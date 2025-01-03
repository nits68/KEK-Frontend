<script setup lang="ts">
import { useAppStore } from '../stores/appStore';
import { useOfferssStore } from '../stores/offersStore';

import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

const appStore = useAppStore();
const offersStore = useOfferssStore();

onMounted(() => {
  appStore.actOffersFilter = '';
  offersStore.getPaginatedActiveOffers();
});

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.actOffersFilter) {
    appStore.actOffersFilter = '';
  }
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
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-3 q-mr-sm">
        <q-input
          v-model="appStore.actOffersFilter"
          dense
          filled
          label="Filter"
          type="text"
          width="100%"
          @update:model-value="filterUpdate()"
        />
      </div>
      <div class="col-xs-12 col-sm-8 col-md-8 col-lg-9 q-gutter-x-sm">
        <q-btn color="blue" :disable="offersStore.pagination.page == 1" no-caps @click="firstPage()">&lt;&lt;</q-btn>
        <q-btn color="blue" :disable="offersStore.pagination.page == 1" no-caps @click="prevPage()">&lt;</q-btn>
        <q-btn
          color="blue"
          :disable="offersStore.pagination.page == offersStore.numberOfPage"
          no-caps
          @click="nextPage()"
          >&gt;</q-btn
        >
        <q-btn
          color="blue"
          :disable="offersStore.pagination.page == offersStore.numberOfPage"
          no-caps
          @click="lastPage()"
          >&gt;&gt;</q-btn
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
              :disable="e.order_quantity == 0 || e.order_quantity > e.quantity"
              flat
              label="Kosárba"
              @click="appStore.basketCounter++"
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
.q-page {
  background-image: url('../assets/kek_basket.png');
  background-repeat: no-repeat;
  background-position: center;
}
</style>
