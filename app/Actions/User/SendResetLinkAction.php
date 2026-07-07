<?php

namespace App\Actions\User;

use Illuminate\Support\Facades\Password;

class SendResetLinkAction
{
    public function execute(string $email): string
    {
        return Password::sendResetLink(['email' => $email]);
    }
}
