<script setup lang="ts">
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';

const faqs = [
    {
        question: 'Preciso entender de contabilidade?',
        answer: 'Não. O Precifica traduz seus custos em números simples: quanto custa produzir, quanto cobrar e quanto sobra no final do mês.',
    },
    {
        question: 'Funciona para qualquer tipo de receita?',
        answer: 'Sim. Você cadastra os ingredientes, define o rendimento da receita e o sistema calcula o custo por unidade — seja pastel, bolo, brigadeiro ou salgado.',
    },
    {
        question: 'Posso testar antes de pagar?',
        answer: 'Sim. Crie sua conta gratuitamente e comece a montar suas receitas. Você só precisa se cadastrar para acessar o dashboard.',
    },
    {
        question: 'Meus dados ficam seguros?',
        answer: 'Utilizamos autenticação segura com sessão criptografada. Seus dados de receitas e custos ficam vinculados à sua conta e não são compartilhados.',
    },
];
</script>

<template>
    <section class="border-b border-border bg-muted/30">
        <div class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
            <div class="flex max-w-2xl flex-col gap-4">
                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Perguntas frequentes
                </h2>
                <p class="text-lg text-muted-foreground">
                    Tire suas dúvidas antes de começar a precificar.
                </p>
            </div>

            <Accordion
                type="single"
                collapsible
                class="w-full"
            >
                <AccordionItem
                    v-for="faq in faqs"
                    :key="faq.question"
                    :value="faq.question"
                >
                    <AccordionTrigger>{{ faq.question }}</AccordionTrigger>
                    <AccordionContent class="text-muted-foreground">
                        {{ faq.answer }}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </section>
</template>
