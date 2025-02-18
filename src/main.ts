import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { apolloProvider } from './graphql/apollo-client';

const app = createApp(App);

app.use(router);
app.use(apolloProvider);
app.mount('#app');
