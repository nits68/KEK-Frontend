<script setup lang="ts">
import { useOfferssStore } from '../stores/offersStore';
import { useI18n } from 'vue-i18n';

const offersStore = useOfferssStore();
const { t } = useI18n();

async function firstPage() {
  offersStore.pagination.page = 1;
  await offersStore.getPaginatedActiveOffers();
}

async function prevPage() {
  offersStore.pagination.page--;
  await offersStore.getPaginatedActiveOffers();
}

async function nextPage() {
  offersStore.pagination.page++;
  await offersStore.getPaginatedActiveOffers();
}

async function lastPage() {
  offersStore.pagination.page = offersStore.numberOfPage;
  await offersStore.getPaginatedActiveOffers();
}
</script>

<template>
  <div class="col-xs-12 col-sm-8 col-md-8 col-lg-9 q-gutter-x-sm text-center">
    <q-btn
      color="blue"
      :disable="offersStore.pagination.page == 1 || offersStore.numberOfPage == 0"
      label="<<"
      no-caps
      @click="firstPage()"
    />
    <q-btn
      color="blue"
      :disable="offersStore.pagination.page == 1 || offersStore.numberOfPage == 0"
      label="<"
      no-caps
      @click="prevPage()"
    />
    <q-btn
      color="blue"
      :disable="offersStore.pagination.page == offersStore.numberOfPage || offersStore.numberOfPage == 0"
      label=">"
      no-caps
      @click="nextPage()"
    />
    <q-btn
      color="blue"
      :disable="offersStore.pagination.page == offersStore.numberOfPage || offersStore.numberOfPage == 0"
      label=">>"
      no-caps
      @click="lastPage()"
    >
    </q-btn>
    <q-badge align="bottom" color="red" rounded
      >{{ t('page') }} {{ offersStore.pagination.page }} / {{ offersStore.numberOfPage }}</q-badge
    >
  </div>
</template>

<style lang="scss" scoped></style>
