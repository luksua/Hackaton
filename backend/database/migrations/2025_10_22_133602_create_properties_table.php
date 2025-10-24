<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
         Schema::create('properties', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('owner_id');
        $table->unsignedBigInteger('category_id');
        $table->string('address');
        $table->string('city');
        $table->decimal('area', 8, 2)->nullable();
        $table->decimal('price', 10, 2)->nullable();
        $table->text('description')->nullable();
        $table->integer('bedrooms')->nullable();
        $table->integer('bathrooms')->nullable();
        $table->boolean('is_featured')->default(false);

        // Declarar transaction_type antes de usar AFTER en otras columnas
        $table->enum('transaction_type', ['rent', 'sale'])->default('rent');

        // Luego listing_status (sin ->after)
        $table->enum('listing_status', ['available', 'reserved', 'rented', 'sold', 'inactive'])
              ->default('available');

        // Asegurar que sale_status existe si sale_type usa ->after('sale_status')
        // $table->enum('sale_status', ['pending','completed'])->nullable();

        $table->enum('sale_type', ['normal', 'installment'])->nullable();
        $table->date('sold_at')->nullable();
        $table->unsignedBigInteger('buyer_id')->nullable();
        $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
