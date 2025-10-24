<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with('bill.billable')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $payment = DB::transaction(function () use ($validated) {
            $payment = Payment::create($validated);

            // Actualizar estado de la cuenta
            $bill = Bill::find($validated['bill_id']);
            $totalPaid = $bill->payments()->sum('amount') + $validated['amount'];

            if ($totalPaid >= $bill->amount) {
                $bill->update(['status' => 'paid']);
            }

            return $payment;
        });

        return response()->json([
            'message' => '💳 Pago registrado correctamente',
            'data' => $payment->load('bill.billable'),
        ], 201);
    }
}
