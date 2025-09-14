<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Transaction;

use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function storeAppointment(Request $request)
    {
        // Validate ข้อมูลก่อนบันทึก
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|string',
            'service' => 'required|string',
        ]);

        // เช็คว่ามีการจองเวลานี้แล้วหรือยัง
        $exists = Appointment::where('date', $request->date)
            ->where('time', $request->time)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'นัดหมายนี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น',
            ], 409); // 409 Conflict
        }

        // ถ้าไม่ซ้ำ -> สร้าง appointment ใหม่
        $appointment = Appointment::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'date' => $request->date,
            'time' => $request->time,
            'service' => $request->service,
            'status' => 0, // default
        ]);

        return response()->json([
            'message' => 'นัดหมายสำเร็จ',
            'appointment' => $appointment,
        ], 201);
    }

    // ดึงนัดหมายตามวันที่
    public function getAppointments(Request $request)
    {
        $date = $request->query('date', date('Y-m-d'));
        return Appointment::where('date', $date)->get();
    }

    // เปลี่ยนสถานะนัดหมาย
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:1,2', // 1 = Confirm, 2 = Cancel
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->status = $request->status;
        $appointment->save();

        // สร้าง Transaction ถ้า status = 1 (confirm)
        if ($appointment->status == 1) {
            Transaction::firstOrCreate(
                ['appointment_id' => $appointment->id], // ป้องกันสร้างซ้ำ
                [
                    'paid_amount' => 0,
                    'payment_type' => 0, // 0 = ยังไม่ชำระ
                ]
            );
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'appointment' => $appointment
        ]);
    }
}
