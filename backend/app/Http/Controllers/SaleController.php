<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Bill;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        return Sale::with(['property', 'tenant', 'bills'])->get();
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'property_id' => 'required|exists:properties,id',
        'tenant_id' => 'required|exists:users,id',
        'total_amount' => 'required|numeric|min:0',
        'sale_type' => 'required|in:normal,installment',
        'installments' => 'nullable|integer|min:1',
        'installment_amount' => 'nullable|numeric|min:0',
        'sale_date' => 'required|date',
    ]);

    $sale = Sale::create($validated);

    // 🔄 Si la venta es a crédito, generar automáticamente las cuotas (bills)
    if ($validated['sale_type'] === 'installment' && $validated['installments']) {
        for ($i = 0; $i < $validated['installments']; $i++) {
            Bill::create([
                'sale_id' => $sale->id,
                'contract_id' => null,
                'due_date' => now()->addMonths($i + 1),
                'amount' => $validated['installment_amount'],
                'status' => 'pending',
            ]);
        }
    }

    // Cambiar estado de la propiedad a "sold"
    $sale->property->update(['listing_status' => 'sold']);

    return response()->json($sale->load(['property', 'tenant', 'bills']), 201);
}


    public function show($id)
    {
        return Sale::with(['property', 'tenant', 'bills'])->findOrFail($id);
    }

    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();
        return response()->json(['message' => 'Venta eliminada correctamente']);
    }
}
