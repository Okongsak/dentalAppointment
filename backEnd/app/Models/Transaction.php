<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'paid_amount',
        'payment_type',
    ];

    // Relation: Transaction belongs to Appointment
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
