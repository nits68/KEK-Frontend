<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { useOfferssStore } from '../stores/offersStore';
import { useUsersStore } from '../stores/usersStore';
import { useI18n } from 'vue-i18n';
import { onMounted, watch } from 'vue';
import OfferCard from '../components/OfferCard.vue';

// import { useRouter } from 'vue-router';

const appStore = useAppStore();
const offersStore = useOfferssStore();
const usersStore = useUsersStore();

const { t } = useI18n();

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

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.actOffersFilter) {
    appStore.actOffersFilter = '';
  }
  offersStore.pagination.page = 1;
  await offersStore.getPaginatedActiveOffers();
}

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
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3 q-mr-sm q-mb-sm">
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
      </div>
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
