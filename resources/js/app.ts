import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './Stores/auth';
import { useThemeStore } from './Stores/theme';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

useThemeStore(pinia).initialize();

router.isReady().then(async () => {
    await useAuthStore(pinia).initialize();
    app.mount('#app');
});
