<?php

namespace App\Http\Controllers\Api\Auth;

use App\Actions\User\LoginUserAction;
use App\Actions\User\ResetPasswordAction;
use App\Actions\User\SendResetLinkAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request, LoginUserAction $loginUserAction): JsonResponse
    {
        $user = $loginUserAction->execute(
            email: $request->string('email')->toString(),
            password: $request->string('password')->toString(),
            remember: $request->boolean('remember'),
        );

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        Auth::guard('sanctum')->forgetUser();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function forgotPassword(
        ForgotPasswordRequest $request,
        SendResetLinkAction $sendResetLinkAction,
    ): JsonResponse {
        $status = $sendResetLinkAction->execute(
            email: $request->string('email')->toString(),
        );

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }

    public function resetPassword(
        ResetPasswordRequest $request,
        ResetPasswordAction $resetPasswordAction,
    ): JsonResponse {
        $status = $resetPasswordAction->execute($request->validated());

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }
}
