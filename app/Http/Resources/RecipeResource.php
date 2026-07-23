<?php

namespace App\Http\Resources;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Recipe */
class RecipeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'yield_quantity' => $this->yield_quantity,
            'yield_unit' => $this->yield_unit->value,
            'yield_unit_label' => $this->yield_unit->label(),
            'ingredients_count' => $this->when(
                isset($this->ingredients_count),
                $this->ingredients_count,
            ),
            'ingredients' => $this->whenLoaded('ingredients', function () {
                return $this->ingredients->map(fn ($ingredient) => [
                    'id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'unit' => $ingredient->unit->value,
                    'unit_label' => $ingredient->unit->label(),
                    'quantity' => $ingredient->pivot->quantity,
                ])->values();
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
