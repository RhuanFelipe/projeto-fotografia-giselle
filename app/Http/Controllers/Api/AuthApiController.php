<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthApiController extends Controller
{
    public function login(LoginRequest $request)
    {
        $login = trim($request->login);
        $senha = trim($request->senha);

        // Busca por email ou nome de usuário
        $usuario = Usuario::where('email', $login)
            ->orWhere('nome', 'like', "%{$login}%")
            ->first();

        // Compatibilidade com login 'admin'
        if (!$usuario && strtolower($login) === 'admin') {
            $usuario = Usuario::where('id', 1)->first();
        }

        if (!$usuario || !Hash::check($senha, $usuario->senha)) {
            return response()->json([
                'sucesso' => false,
                'erro' => 'Credenciais inválidas. Verifique seu usuário e senha.',
            ], 401);
        }

        Auth::login($usuario, (bool) $request->lembrar);

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Autenticado com sucesso!',
            'usuario' => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Sessão encerrada com sucesso.',
        ]);
    }

    public function me()
    {
        $usuario = Auth::user();

        if (!$usuario) {
            return response()->json(['autenticado' => false], 401);
        }

        return response()->json([
            'autenticado' => true,
            'usuario' => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
            ],
        ]);
    }
}

