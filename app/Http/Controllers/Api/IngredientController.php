<?php

namespace App\Http\Controllers\Api;

use App\Actions\Ingredient\CreateIngredientAction;
use App\Actions\Ingredient\DeleteIngredientAction;
use App\Actions\Ingredient\UpdateIngredientAction;
use App\Enums\IngredientUnit;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ingredient\StoreIngredientRequest;
use App\Http\Requests\Ingredient\UpdateIngredientRequest;
use App\Http\Resources\IngredientResource;
use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IngredientController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Ingredient::class);

        $query = Ingredient::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('name');

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->string('name')->toString().'%');
        }

        if ($request->filled('unit')) {
            $unit = IngredientUnit::tryFrom($request->string('unit')->toString());

            if ($unit !== null) {
                $query->where('unit', $unit->value);
            }
        }

        return IngredientResource::collection(
            $query->paginate($request->integer('per_page', 15)),
        );
    }

    public function store(
        StoreIngredientRequest $request,
        CreateIngredientAction $createIngredientAction,
    ): JsonResponse {
        $this->authorize('create', Ingredient::class);

        $ingredient = $createIngredientAction->execute(
            user: $request->user(),
            data: $request->validated(),
        );

        return (new IngredientResource($ingredient))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Ingredient $ingredient): IngredientResource
    {
        $this->authorize('view', $ingredient);

        return new IngredientResource($ingredient);
    }

    public function update(
        UpdateIngredientRequest $request,
        Ingredient $ingredient,
        UpdateIngredientAction $updateIngredientAction,
    ): IngredientResource {
        $this->authorize('update', $ingredient);

        $ingredient = $updateIngredientAction->execute(
            ingredient: $ingredient,
            data: $request->validated(),
        );

        return new IngredientResource($ingredient);
    }

    public function destroy(
        Ingredient $ingredient,
        DeleteIngredientAction $deleteIngredientAction,
    ): JsonResponse {
        $this->authorize('delete', $ingredient);

        $deleteIngredientAction->execute($ingredient);

        return response()->json([
            'message' => 'Ingrediente removido com sucesso.',
        ]);
    }
}
