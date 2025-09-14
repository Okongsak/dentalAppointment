<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'age',
        'gender',
        'allergies',
        'phone',
        'chronic_disease',
        'dental_history',   // เก็บ JSON
    ];
}
