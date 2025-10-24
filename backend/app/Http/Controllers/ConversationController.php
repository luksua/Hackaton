<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    /**
     * Obtener o crear una conversación entre inquilino y propietario
     */
    public function openConversation(Request $request)
    {
        $request->validate([
            'landlord_id' => 'required|exists:users,id',
        ]);

        $tenantId = Auth::id();
        $landlordId = $request->landlord_id;

        // Buscar si ya existe una conversación entre ambos
        $conversation = Conversation::where(function ($query) use ($tenantId, $landlordId) {
            $query->where('tenant_id', $tenantId)
                  ->where('landlord_id', $landlordId);
        })->orWhere(function ($query) use ($tenantId, $landlordId) {
            $query->where('tenant_id', $landlordId)
                  ->where('landlord_id', $tenantId);
        })->first();

        // Si no existe, crearla
        if (!$conversation) {
            $conversation = Conversation::create([
                'tenant_id' => $tenantId,
                'landlord_id' => $landlordId,
            ]);
        }

        return response()->json($conversation, 200);
    }

    /**
     * Listar todas las conversaciones del usuario actual
     */
    public function index()
    {
        $userId = Auth::id();

        $conversations = Conversation::where('tenant_id', $userId)
            ->orWhere('landlord_id', $userId)
            ->with(['tenant', 'landlord'])
            ->latest()
            ->get();

        return response()->json($conversations);
    }
}
