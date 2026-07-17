<?php

namespace App\Http\Requests\Ingredient;

use App\Enums\IngredientUnit;
use App\Models\Ingredient;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIngredientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Ingredient $ingredient */
        $ingredient = $this->route('ingredient');

        return [
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('ingredients', 'name')
                    ->where(fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->whereNull('deleted_at'))
                    ->ignore($ingredient->id),
            ],
            'unit' => ['required', Rule::enum(IngredientUnit::class)],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.9999'],
        ];
    }
}
