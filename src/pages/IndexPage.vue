<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { useOfferssStore } from '../stores/offersStore';
import { useUsersStore } from '../stores/usersStore';
import { onMounted, watch } from 'vue';
import OfferCard from '../components/OfferCard.vue';
import PagingBar from '../components/PagingBar.vue';
import FilterInput from '../components/FilterInput.vue';

// import { useRouter } from 'vue-router';

const appStore = useAppStore();
const offersStore = useOfferssStore();
const usersStore = useUsersStore();


onMounted(async () => {
  appStore.resetAppStore();
  offersStore.pagination.page = 1;
  offersStore.pagination.rowsPerPage = 12;
  await offersStore.getPaginatedActiveOffers();
});

watch(
  () => usersStore.loggedUser?.email,
  async () => {
    appStore.resetAppStore();
    offersStore.pagination.page = 1;
    offersStore.pagination.rowsPerPage = 12;
    await offersStore.getPaginatedActiveOffers();
  },
);

</script>

<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3 q-mr-sm q-mb-sm">
        <FilterInput />
      </div>
      <PagingBar />
    </div>

    <div class="row">
      <div v-for="(_, index) in offersStore.offers" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <OfferCard :index="index" />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 3vw;
}
</style>
