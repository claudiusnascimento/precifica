<?php

namespace App\Enums;

enum IngredientUnit: string
{
    case Gram = 'gram';
    case Kilogram = 'kilogram';
    case Milliliter = 'milliliter';
    case Liter = 'liter';
    case Unit = 'unit';

    public function label(): string
    {
        return match ($this) {
            self::Gram => 'Grama',
            self::Kilogram => 'Quilograma',
            self::Milliliter => 'Mililitro',
            self::Liter => 'Litro',
            self::Unit => 'Unidade',
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $unit): array => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ],
            self::cases(),
        );
    }
}
