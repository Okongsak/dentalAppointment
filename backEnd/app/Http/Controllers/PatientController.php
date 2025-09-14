<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // ดึงรายชื่อผู้ป่วยทั้งหมด
    public function getPatient()
    {
        return response()->json(Patient::all());
    }

    // เพิ่มผู้ป่วยใหม่
    public function storePatient(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'age' => 'nullable|string',
                'gender' => 'nullable|string',
                'allergies' => 'nullable|string',
                'phone' => 'nullable|string',
                'chronic_disease' => 'nullable|string',
                'dental_history' => 'nullable|string',// JSON
            ]);

            $patient = Patient::create($validated);

            return response()->json([
                'message' => 'Patient created successfully',
                'data'    => $patient,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        }
    }

    // แก้ไขข้อมูลผู้ป่วย
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'nullable|string',
            'gender' => 'nullable|string',
            'allergies' => 'nullable|string',
            'phone' => 'nullable|string',
            'chronic_disease' => 'nullable|string',
            'dental_history' => 'nullable|string',// JSON
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully',
            'data'    => $patient,
        ]);
    }

    // ลบผู้ป่วย
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json([
            'message' => 'Patient deleted successfully'
        ]);
    }
}
