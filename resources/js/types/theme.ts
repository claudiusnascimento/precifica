export type ThemeMode = 'light' | 'dark';

export type ThemeVariables = Record<string, string>;

export interface ThemePreset {
    id: string;
    label: string;
    shadcnCode?: string;
    variables: Record<ThemeMode, ThemeVariables>;
}

export const THEME_CSS_VARIABLES = [
    'radius',
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
] as const;

export type ThemeCssVariable = (typeof THEME_CSS_VARIABLES)[number];
