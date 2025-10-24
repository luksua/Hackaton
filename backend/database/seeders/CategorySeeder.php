<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Casa', 'description' => 'Propiedades tipo casa unifamiliar'],
            ['name' => 'Departamento', 'description' => 'Departamentos en edificios o condominios'],
            ['name' => 'Terreno', 'description' => 'Lotes o terrenos disponibles'],
            ['name' => 'Local Comercial', 'description' => 'Locales y oficinas para negocios'],
            ['name' => 'Bodega', 'description' => 'Espacios para almacenamiento o depósitos'],
        ];

        foreach ($categories as $data) {
            Category::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
            ]);
        }
    }
}
