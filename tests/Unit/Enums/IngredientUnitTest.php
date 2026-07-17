<?php

use App\Enums\IngredientUnit;

test('ingredient unit exposes portuguese labels', function () {
    expect(IngredientUnit::Gram->label())->toBe('Grama')
        ->and(IngredientUnit::Kilogram->label())->toBe('Quilograma')
        ->and(IngredientUnit::Milliliter->label())->toBe('Mililitro')
        ->and(IngredientUnit::Liter->label())->toBe('Litro')
        ->and(IngredientUnit::Unit->label())->toBe('Unidade');
});

test('ingredient unit options returns value and label pairs', function () {
    $options = IngredientUnit::options();

    expect($options)->toHaveCount(5)
        ->and($options[0])->toMatchArray([
            'value' => 'gram',
            'label' => 'Grama',
        ]);
});

test('available unit enums', function () {
    $enums = IngredientUnit::cases();
    expect($enums)->toHaveCount(5)
        ->and($enums[0]->value)->toBe('gram')
        ->and($enums[1]->value)->toBe('kilogram')
        ->and($enums[2]->value)->toBe('milliliter')
        ->and($enums[3]->value)->toBe('liter')
        ->and($enums[4]->value)->toBe('unit');
});
