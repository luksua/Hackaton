<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Iniciar sesión (API)
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Usa explícitamente el guard "web"
        if (!Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::guard('web')->user();

        // Borrar tokens anteriores
        $user->tokens()->delete();

        // Crear nuevo token para Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    /**
     * Cerrar sesión
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
