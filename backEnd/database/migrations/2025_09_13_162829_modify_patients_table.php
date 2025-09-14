<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('chronic_disease')->nullable()->after('gender'); // โรคประจำตัว
            $table->string('phone')->nullable()->after('allergies');         // เบอร์โทร
            $table->dropColumn('address');
            $table->text('dental_history')->change(); // dental_history เก็บเป็น JSON ใหม่ (date, CC, note)
        });
    }

    public function down(): void {
        Schema::table('patients', function (Blueprint $table) {
            $table->text('address')->nullable()->after('allergies');
            $table->dropColumn(['chronic_disease', 'phone']);
            $table->text('dental_history')->change();
        });
    }
};
