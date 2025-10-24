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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade'); // comprador (es un tenant)
            $table->decimal('total_amount', 10, 2);
            $table->enum('sale_type', ['normal', 'installment'])->default('normal');
            $table->integer('installments')->nullable();
            $table->decimal('installment_amount', 10, 2)->nullable();
            $table->date('sale_date');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
