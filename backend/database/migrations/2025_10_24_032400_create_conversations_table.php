<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id(); // unsignedBigInteger auto
            $table->unsignedBigInteger('tenant_id');
            $table->unsignedBigInteger('landlord_id');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('landlord_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
