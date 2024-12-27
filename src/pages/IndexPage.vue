<script setup lang="ts">
import { useUsersStore } from '../stores/usersStore';


import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

const usersStore = useUsersStore();
// const router = useRouter();

const google =  import.meta.env.VITE_VUE_APP_CLIENT_ID;
const backendUrl = import.meta.env.VITE_VUE_APP_BACKEND_URL;

onMounted(() => {
  // s.ManyGetAll();
});
</script>

<template>
  <q-page class="column flex-center">
    <p>{{ usersStore.loggedUser?.email }}</p>
    <p>Google1: {{ google }}</p>
    <p>Backend URL: {{ backendUrl }}</p>
  </q-page>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 3vw;
}
</style>
