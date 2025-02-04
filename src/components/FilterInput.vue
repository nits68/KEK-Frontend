<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { useOfferssStore } from '../stores/offersStore';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const offersStore = useOfferssStore();

const { t } = useI18n();

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.actOffersFilter) {
    appStore.actOffersFilter = '';
  }
  offersStore.pagination.page = 1;
  await offersStore.getPaginatedActiveOffers();
}

</script>

<template>
  <q-input
    v-model="appStore.actOffersFilter"
    clearable
    dense
    filled
    :label="t('filter')"
    type="text"
    width="100%"
    @clear="filterUpdate()"
    @keypress.enter.prevent="filterUpdate()"
  >
    <template v-slot:append>
      <q-btn flat icon="search" round @click="filterUpdate()">
        <q-badge align="top" color="red" floating rounded>{{ offersStore.pagination.rowsNumber }}</q-badge>
      </q-btn>
    </template>
  </q-input>
</template>

<style lang="scss" scoped></style>
