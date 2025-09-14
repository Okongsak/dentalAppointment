<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('allergies')->nullable(); // แพ้ยา
            $table->text('address')->nullable();
            $table->text('dental_history')->nullable(); // ประวัติการทำทันตกรรม
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('patients');
    }
};

