<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TransactionController;

Route::post('/addpatients', [PatientController::class, 'storePatient']);
Route::post('/editpatients/{id}', [PatientController::class, 'update']);
Route::get('/getpatients', [PatientController::class, 'getPatient']);
Route::delete('/deletepatients/{id}', [PatientController::class, 'destroy']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/appointments', [AppointmentController::class, 'storeAppointment']);
Route::get('/getAppointments', [AppointmentController::class, 'getAppointments']);
Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

Route::get('/transactions', [TransactionController::class, 'getConfirmedTransactions']);
Route::post('/updatetransactions/{id}', [TransactionController::class, 'update']);
