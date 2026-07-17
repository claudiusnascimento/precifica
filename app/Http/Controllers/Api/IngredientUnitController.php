<?php

namespace App\Http\Controllers\Api;

use App\Enums\IngredientUnit;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class IngredientUnitController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => IngredientUnit::options(),
        ]);
    }
}
