<script setup lang="ts">
import { useUsersStore } from '../stores/usersStore';
import { useOfferssStore } from '../stores/offersStore';
import { useAppStore } from '../stores/appStore';

const usersStore = useUsersStore();
const appStore = useAppStore();
const offersStore = useOfferssStore();

interface IProps {
  index: number;
}

const prop = defineProps<IProps>();
</script>

<template>
  <q-card class="q-ma-sm">
    <q-img
      loading="eager"
      :ratio="1 / 1"
      :src="
        offersStore.offers[prop.index]!.picture_url == 'none'
          ? offersStore.offers[prop.index]!.product!.picture_url
          : offersStore.offers[prop.index]!.picture_url
      "
    >
      <div class="text-h6 absolute-top text-center">
        {{ offersStore.offers[prop.index]!.product!.product_name! }}
      </div>
      <div class="text-h7 absolute-bottom text-center">
        {{ offersStore.offers[prop.index]!.unit_price }}Ft/{{ offersStore.offers[prop.index]!.unit }}
      </div>
    </q-img>

    <q-card-actions>
      <q-input
        v-model.number="offersStore.offers[prop.index]!.order_quantity"
        class="q-mr-sm"
        clearable
        dense
        :disable="!usersStore.loggedUser"
        :max="offersStore.offers[prop.index]!.quantity"
        min="0"
        outlined
        rounded
        style="max-width: 100px"
        type="number"
        @clear="offersStore.offers[prop.index]!.order_quantity = 0"
      />
      <q-btn
        color="primary"
        :disable="
          offersStore.offers[prop.index]!.order_quantity == 0 ||
          offersStore.offers[prop.index]!.order_quantity! > offersStore.offers[prop.index]!.quantity! ||
          !usersStore.loggedUser
        "
        flat
        label="Kosárba"
        @click="
          appStore.basketCounter++;
          offersStore.offers[prop.index]!.order_quantity = 0;
        "
      />

      <q-space />

      <q-btn
        color="grey"
        dense
        flat
        :icon="offersStore.offers[prop.index]!.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        round
        @click="offersStore.offers[prop.index]!.expanded = !offersStore.offers[prop.index]!.expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="offersStore.offers[prop.index]!.expanded">
        <q-separator />
        <q-card-section class="text-subtitle3">
          <div><b>Info:</b> {{ offersStore.offers[prop.index]!.info }}</div>
          <div><b>Kistermelő:</b> {{ offersStore.offers[prop.index]!.offer!.name }}</div>
          <div>
            <b>Készleten:</b> {{ offersStore.offers[prop.index]!.quantity }}{{ offersStore.offers[prop.index]!.unit }}
          </div>
          <div><b>Dátum:</b> {{ offersStore.offers[prop.index]!.offer_start! }}</div>
          <div><b>Kategória:</b> {{ offersStore.offers[prop.index]!.category?.category_name }}</div>
          <div><b>Fő kategórira:</b> {{ offersStore.offers[prop.index]!.category?.main_category }}</div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<style lang="scss" scoped></style>
