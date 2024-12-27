import { defineBoot } from '#q-app/wrappers';
import vue3GoogleLogin from 'vue3-google-login';

export default defineBoot(({ app }) => {
    app.use(vue3GoogleLogin, {
        clientId: import.meta.env.VITE_VUE_APP_CLIENT_ID,
      });
});
