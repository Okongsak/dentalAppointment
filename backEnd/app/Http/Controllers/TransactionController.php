<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Appointment;

class TransactionController extends Controller
{
    // ดึง transactions ของ appointment ที่ confirm
    public function getConfirmedTransactions(Request $request)
    {
        $transactions = Transaction::with('appointment')
            ->whereHas('appointment', function ($query) {
                $query->where('status', 1); // 1 = confirm
            })
            ->get();

        return response()->json($transactions);
    }

    // สร้าง transaction ใหม่
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'paid_amount' => 'required|numeric|min:0',
            'payment_type' => 'required|integer|in:0,1,2,3,4',
        ]);

        $transaction = Transaction::create($validated);

        return response()->json([
            'message' => 'Transaction created successfully',
            'data' => $transaction,
        ]);
    }

    // อัปเดต transaction
    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_type' => 'nullable|integer|in:0,1,2,3,4',
        ]);

        $transaction->update($validated);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'data' => $transaction,
        ]);
    }
}
