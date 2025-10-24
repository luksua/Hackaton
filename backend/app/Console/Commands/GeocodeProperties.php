<?php
// app/Console/Commands/GeocodeProperties.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Property;
use Illuminate\Support\Facades\Http;

class GeocodeProperties extends Command
{
    protected $signature = 'properties:geocode {--limit=50}';
    protected $description = 'Geocode properties without lat/lng using Nominatim (OpenStreetMap)';

    public function handle()
    {
        $limit = (int) $this->option('limit');

        $properties = Property::whereNull('latitude')->whereNotNull('address')->take($limit)->get();

        foreach ($properties as $p) {
            $q = trim($p->address . ', ' . $p->city);
            $this->info("Geocoding: {$p->id} => {$q}");

            try {
                // Nominatim (solo pruebas). Respeta su Usage Policy.
                $response = Http::get('https://nominatim.openstreetmap.org/search', [
                    'q' => $q,
                    'format' => 'json',
                    'limit' => 1,
                ]);

                if ($response->ok() && !empty($response->json())) {
                    $data = $response->json()[0];
                    $p->latitude = $data['lat'];
                    $p->longitude = $data['lon'];
                    $p->save();
                    $this->info("Saved lat: {$p->latitude}, lng: {$p->longitude}");
                } else {
                    $this->warn("No coords for property {$p->id}");
                }
            } catch (\Exception $e) {
                $this->error("Error geocoding {$p->id}: " . $e->getMessage());
            }

            // Pausa para respetar rate limits (ajusta según el proveedor)
            sleep(1);
        }

        $this->info('Geocoding finished.');
    }
}