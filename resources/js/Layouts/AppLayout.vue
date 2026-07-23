<script setup lang="ts">
import { BookOpen, ChefHat, Egg, Home } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import ThemeSelector from '@/Components/ThemeSelector.vue';
import { Button } from '@/Components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { useAuthStore } from '@/Stores/auth';

const navItems = [
    { name: 'dashboard', label: 'Dashboard', icon: Home },
    { name: 'ingredients.index', label: 'Ingredientes', icon: Egg },
    { name: 'recipes.index', label: 'Receitas', icon: BookOpen },
];

const activeLinkClass =
    'data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:hover:bg-sidebar-primary data-[active=true]:hover:text-sidebar-primary-foreground';
</script>

<template>
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div class="flex h-10 items-center gap-2 px-1">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <ChefHat class="h-4 w-4" />
                    </span>
                    <span class="text-lg font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        Precifica
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu class="gap-1 px-2">
                    <SidebarMenuItem
                        v-for="item in navItems"
                        :key="item.name"
                    >
                        <SidebarMenuButton
                            as-child
                            :tooltip="item.label"
                            :class="activeLinkClass"
                        >
                            <RouterLink
                                :to="{ name: item.name }"
                                active-class="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                            >
                                <component :is="item.icon" />
                                <span>{{ item.label }}</span>
                            </RouterLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>

        <SidebarInset>
            <header class="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
                <div class="flex min-w-0 items-center gap-2">
                    <SidebarTrigger />
                    <h1 class="truncate text-sm font-medium text-muted-foreground">
                        Gestão de precificação e custos
                    </h1>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                    <ThemeSelector />
                    <Button
                        size="sm"
                        variant="outline"
                        @click="useAuthStore().logout()"
                    >
                        Sair
                    </Button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-6">
                <RouterView />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
