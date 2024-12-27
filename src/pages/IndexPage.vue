<script setup lang="ts">
import { useUsersStore } from '../stores/usersStore';


import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

const usersStore = useUsersStore();
// const router = useRouter();

const google = process.env.VITE_VUE_APP_CLIENT_ID;
const google2 = import.meta.env.VITE_VUE_APP_CLIENT_ID;
const baseUrl = process.env.BASE_URL;

onMounted(() => {
  // s.ManyGetAll();
});
</script>

<template>
  <q-page class="column flex-center">
    <p>{{ usersStore.loggedUser?.email }}</p>
    <p>{{ google }}</p>
    <p>{{ google2 }}</p>
    <p>{{ baseUrl }}</p>
  </q-page>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 3vw;
}
</style>
