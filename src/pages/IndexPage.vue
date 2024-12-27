<script setup lang="ts">
import { useUsersStore } from '../stores/usersStore';


import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

const usersStore = useUsersStore();
// const router = useRouter();

onMounted(() => {
  // s.ManyGetAll();
});
</script>

<template>
  <q-page class="column flex-center">
    <p>{{ usersStore.loggedUser?.email }}</p>
  </q-page>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 3vw;
}
</style>
