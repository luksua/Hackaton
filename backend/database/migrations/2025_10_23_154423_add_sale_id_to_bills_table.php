<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('bills', function (Blueprint $table) {
        $table->foreignId('sale_id')->nullable()->constrained('sales')->onDelete('cascade')->after('contract_id');
    });
}

public function down(): void
{
    Schema::table('bills', function (Blueprint $table) {
        $table->dropForeign(['sale_id']);
        $table->dropColumn('sale_id');
    });
}
};
