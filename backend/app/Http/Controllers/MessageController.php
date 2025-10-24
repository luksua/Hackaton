<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Conversation;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Mostrar todos los mensajes de una conversación
     */
    public function index($conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Verificar que el usuario pertenece a la conversación
        if (!in_array(Auth::id(), [$conversation->tenant_id, $conversation->landlord_id])) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Enviar mensaje dentro de una conversación
     */
    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($request->conversation_id);

        // Validar que el usuario pertenece a la conversación
        if (!in_array(Auth::id(), [$conversation->tenant_id, $conversation->landlord_id])) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => Auth::id(),
            'message' => $request->message,
        ]);

        // Emitir evento de broadcasting
        broadcast(new MessageSent($message))->toOthers();


        return response()->json($message);
    }
}
