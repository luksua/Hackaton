<?php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SaleController;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
});
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);

// ✅ Rutas de propiedades
Route::get('/properties/filtered', [PropertyController::class, 'getFilteredProperties']);

Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::get('/featured', [PropertyController::class, 'featured']);
    Route::get('/owner/{id}', [PropertyController::class, 'byOwner']);
    Route::get('/{id}', [PropertyController::class, 'show']);
});


Route::middleware('auth:sanctum')->prefix('properties')->group(function () {
    Route::post('/', [PropertyController::class, 'store']);
    Route::put('/{id}', [PropertyController::class, 'update']);
    Route::delete('/{id}', [PropertyController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/check-token', function (Request $request) {
    return response()->json([
        'authenticated' => true,
        'user' => $request->user(),
    ]);
});

// ✅ Imágenes de propiedades
Route::prefix('property-images')->middleware('auth:sanctum')->group(function () {
    Route::post('/property-images/upload', [PropertyImageController::class, 'store']);
    Route::delete('/{id}', [PropertyImageController::class, 'destroy']);
    Route::get('/{property}', [PropertyImageController::class, 'index']);
});

// Contratos
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::get('/contracts/property/{propertyId}', [ContractController::class, 'getByProperty']);
    Route::post('/contracts', [ContractController::class, 'store']);
    Route::get('/contracts/{id}', [ContractController::class, 'show']);
    Route::put('/contracts/{id}', [ContractController::class, 'update']);
    Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);
});

// Usuarios
Route::get('/users', [UserController::class, 'index']);

// Gestion de Cobro y Pagos
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::get('/sales', [SaleController::class, 'index']);
    Route::apiResource('bills', BillController::class);
    Route::apiResource('payments', PaymentController::class);
});

// Rutas de autenticación
require __DIR__ . '/auth.php';