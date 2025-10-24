<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Property;
use App\Models\Contract;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Categorías
        $this->call(CategorySeeder::class);

        // Propietario
        $owner = User::create([
            'name' => 'Juan Propietario',
            'email' => 'propietario@example.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'phone' => '3001234567',
        ]);

        // Inquilino
        $tenant = User::create([
            'name' => 'Pedro Inquilino',
            'email' => 'inquilino@example.com',
            'password' => Hash::make('password'),
            'role' => 'tenant',
            'phone' => '3009876543',
        ]);

        // Inmueble
        $property = Property::create([
            'owner_id' => $owner->id,
            'category_id' => Category::first()->id,
            'address' => 'Calle 123 #45-67',
            'city' => 'Bogotá',
            'area' => 120,
            'price' => 1500000,
            'description' => 'Hermosa casa con jardín',
        ]);

        // Contrato
        $contract = Contract::create([
            'property_id' => $property->id,
            'tenant_id' => $tenant->id,
            'start_date' => now(),
            'end_date' => now()->addYear(),
            'monthly_rent' => 1500000,
            'status' => 'activo',
        ]);

        // Cuentas de cobro (3 meses)
        for ($i = 1; $i <= 3; $i++) {
            $bill = Bill::create([
                'contract_id' => $contract->id,
                'due_date' => now()->addMonths($i),
                'amount' => 1500000,
                'status' => $i === 1 ? 'pagado' : 'pendiente',
            ]);

            if ($bill->status === 'pagado') {
                Payment::create([
                    'bill_id' => $bill->id,
                    'payment_date' => now(),
                    'amount' => 1500000,
                    'payment_method' => 'transferencia',
                    'notes' => 'Pago puntual del mes ' . $i,
                ]);
            }
        }
    }
}
