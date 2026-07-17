<script setup lang="ts">
import MarketingLayout from '@/Layouts/MarketingLayout.vue';
import LandingAudience from '@/Components/Marketing/LandingAudience.vue';
import LandingBenefits from '@/Components/Marketing/LandingBenefits.vue';
import LandingCta from '@/Components/Marketing/LandingCta.vue';
import LandingExample from '@/Components/Marketing/LandingExample.vue';
import LandingFaq from '@/Components/Marketing/LandingFaq.vue';
import LandingHero from '@/Components/Marketing/LandingHero.vue';
import LandingHowItWorks from '@/Components/Marketing/LandingHowItWorks.vue';
</script>

<template>
    <MarketingLayout>
        <LandingHero />
        <LandingHowItWorks />
        <LandingBenefits />
        <LandingExample />
        <LandingAudience />
        <LandingFaq />
        <LandingCta />
    </MarketingLayout>
</template>
