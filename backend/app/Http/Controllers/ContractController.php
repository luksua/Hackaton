<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    /**
     * 📜 Obtener todos los contratos (con relaciones)
     */
    public function index()
    {
        $contracts = Contract::with(['property', 'tenant'])->get();
        return response()->json($contracts, Response::HTTP_OK);
    }

    /**
     * 🏠 Obtener contratos por propiedad (lo que usa tu frontend)
     */
    public function getByProperty($propertyId)
    {
        $contracts = Contract::with(['property', 'tenant'])
            ->where('property_id', $propertyId)
            ->get();

        return response()->json($contracts, Response::HTTP_OK);
    }

    /**
     * 🆕 Crear un nuevo contrato
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'tenant_id'   => 'required|exists:users,id',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after:start_date',
            'monthly_rent' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('contracts', 'public');
        }

        $contract = Contract::create([
            'property_id' => $request->property_id,
            'tenant_id' => $request->tenant_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'monthly_rent' => $request->monthly_rent,
            'status' => 'active',
            'file_path' => $request->file('file')->store('contracts', 'public'),
        ]);

        return response()->json($contract->load(['property', 'tenant']), Response::HTTP_CREATED);

        if ($sale->sale_type === 'installment') {
             for ($i = 0; $i < $sale->installments; $i++) {
                 Bill::create([
                    'billable_type' => Sale::class,
                    'billable_id'   => $sale->id,
                    'due_date'      => now()->addMonths($i + 1),
                    'amount'        => $sale->installment_amount,
                    'status'        => 'pending',
                    'description'   => "Cuota " . ($i + 1) . " de la venta #{$sale->id}",
                ]);
            }
        }
         
    }

    /**
     * 🧾 Mostrar un contrato específico
     */
    public function show($id)
    {
        $contract = Contract::with(['property', 'tenant'])->findOrFail($id);
        return response()->json($contract, Response::HTTP_OK);
    }

    /**
     * ✏️ Actualizar un contrato
     */
    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after:start_date',
            'monthly_rent' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,expired,finalized',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $contract->update($request->only([
            'start_date',
            'end_date',
            'monthly_rent',
            'status',
        ]));

        return response()->json($contract->load(['property', 'tenant']), Response::HTTP_OK);
    }

    /**
     * 🗑️ Eliminar un contrato
     */
    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Contrato eliminado correctamente.'], Response::HTTP_OK);
    }
}
