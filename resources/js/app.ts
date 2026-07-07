import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useThemeStore } from './Stores/theme';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

useThemeStore(pinia).initialize();

app.mount('#app');
