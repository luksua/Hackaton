<?php


namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Registrar las rutas de broadcast (para canales públicos y privados)
        Broadcast::routes();

        // Cargar las definiciones de canales desde routes/channels.php
        require base_path('routes/channels.php');
    }
}
