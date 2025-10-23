<?php
namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function index()
    {
        return response()->json(
            Bill::with(['billable', 'payments'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'billable_type' => 'required|string|in:App\\Models\\Contract,App\\Models\\Sale',
            'billable_id' => 'required|integer',
            'due_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $bill = Bill::create($validated);

        return response()->json([
            'message' => '✅ Cuenta de cobro creada correctamente',
            'data' => $bill->load('billable'),
        ], 201);
    }

    public function show($id)
    {
        return response()->json(
            Bill::with(['billable', 'payments'])->findOrFail($id)
        );
    }
}
