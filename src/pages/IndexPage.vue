<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { useOfferssStore } from '../stores/offersStore';
import { useUsersStore } from '../stores/usersStore';
import { useI18n } from 'vue-i18n';
import { onMounted, watch } from 'vue';

// import { useRouter } from 'vue-router';

const appStore = useAppStore();
const offersStore = useOfferssStore();
const usersStore = useUsersStore();

const { t } = useI18n();

onMounted(() => {
  appStore.resetAppStore();
  offersStore.pagination.page = 1;
  offersStore.pagination.rowsPerPage = 12;
  offersStore.getPaginatedActiveOffers();
});

watch(() => usersStore.loggedUser?.email, () => {
  appStore.resetAppStore();
  offersStore.pagination.page = 1;
  offersStore.pagination.rowsPerPage = 12;
  offersStore.getPaginatedActiveOffers();
});

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.actOffersFilter) {
    appStore.actOffersFilter = '';
  }
  offersStore.pagination.page = 1;
  await offersStore.getPaginatedActiveOffers();
}

function firstPage() {
  offersStore.pagination.page = 1;
  offersStore.getPaginatedActiveOffers();
}

function prevPage() {
  offersStore.pagination.page--;
  offersStore.getPaginatedActiveOffers();
}

function nextPage() {
  offersStore.pagination.page++;
  offersStore.getPaginatedActiveOffers();
}

function lastPage() {
  offersStore.pagination.page = offersStore.numberOfPage;
  offersStore.getPaginatedActiveOffers();
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
      <div v-for="e in offersStore.offers as any[]" :key="e._id as string" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="q-ma-sm">
          <q-img loading="eager" :ratio="1 / 1" :src="e.picture_url == 'none' ? e.product.picture_url : e.picture_url">
            <div class="text-h6 absolute-top text-center">
              {{ e.product.product_name }}
            </div>
            <div class="text-h7 absolute-bottom text-center">{{ e.unit_price }}Ft/{{ e.unit }}</div>
          </q-img>

          <q-card-actions>
            <q-input
              v-model.number="e.order_quantity"
              class="q-mr-sm"
              clearable
              dense
              :disable="!usersStore.loggedUser"
              :max="e.quantity"
              min="0"
              outlined
              rounded
              style="max-width: 100px"
              type="number"
              @clear="e.order_quantity = 0"
            />
            <q-btn
              color="primary"
              :disable="e.order_quantity == 0 || e.order_quantity > e.quantity || !usersStore.loggedUser"
              flat
              label="Kosárba"
              @click="
                appStore.basketCounter++;
                e.order_quantity = 0;
              "
            />

            <q-space />

            <q-btn
              color="grey"
              dense
              flat
              :icon="e.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              round
              @click="e.expanded = !e.expanded"
            />
          </q-card-actions>

          <q-slide-transition>
            <div v-show="e.expanded">
              <q-separator />
              <q-card-section class="text-subtitle3">
                <div><b>Info:</b> {{ e.info }}</div>
                <div><b>Kistermelő:</b> {{ e.offer.name }}</div>
                <div><b>Készleten:</b> {{ e.quantity }}{{ e.unit }}</div>
                <div><b>Dátum:</b> {{ e.offer_start.slice(0, 10) }}</div>
                <div><b>Kategória:</b> {{ e.category.category_name }}</div>
                <div><b>Fő kategórira:</b> {{ e.category.main_category }}</div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 3vw;
}
// .q-page {
//   background-image: url('../assets/kek_cimer.png');
//   background-repeat: no-repeat;
//   background-position: center;
// }
</style>
