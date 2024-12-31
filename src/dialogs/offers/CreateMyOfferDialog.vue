<script setup lang="ts">
import { Dialog, date } from 'quasar';
import { type IOffer, useOfferssStore } from '../../stores/offersStore';
import { useAppStore } from '../../stores/appStore';
import { type IProduct, useProductsStore } from '../../stores/productsStore';
import { ref } from 'vue';
import { computed } from 'vue';

const appStore = useAppStore();
const offersStore = useOfferssStore();
const productsStore = useProductsStore();
// const router = useRouter();

const options = ref([] as IProduct[]);

async function ShowDialog() {
  // await offersStore.getOfferById();
  offersStore.actOffer = {
    _id: 'bbbb00000000000000000000',
    offer_start: new Date(),
    offer_end: null,
    picture_url: 'none',
  } as IOffer;
  await productsStore.getAllProducts();
  // await categoriesStore.getAllCategories();
  // for filter function:
  Object.assign(options.value, productsStore.products);
}

function HideDialog() {
  offersStore.actOffer = {} as IOffer;
  productsStore.products = [];
  // categoriesStore.categories = [];
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save new offer?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await offersStore.createOffer();
      await offersStore.getPaginatedOffers();
      // appStore.showEditUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Reset() {
  offersStore.actOffer = {
    _id: 'bbbb00000000000000000000',
    offer_start: new Date(),
    offer_end: null,
    picture_url: 'none',
  } as IOffer;
}

function Close() {
  appStore.showCreateOfferDialog = false;
}

function filterFn(val: string, update: any): void {
  Object.assign(options.value, productsStore.products);
  if (val === '') {
    update(() => {});
    return;
  }

  const value = val.toLowerCase();
  update(() => {
    options.value = options.value.filter((v) => v.product_name!.toLowerCase().indexOf(value) > -1);
  });
}

const offerStartConverter = computed({
  get() {
    return date.formatDate(offersStore.actOffer.offer_start as Date, 'YYYY-MM-DD');
  },
  set(newValue) {
    offersStore.actOffer.offer_start = new Date(newValue as string);
  },
});

const offerEndConverter = computed({
  get() {
    return date.formatDate(offersStore.actOffer.offer_end as Date, 'YYYY-MM-DD');
  },
  set(newValue) {
    offersStore.actOffer.offer_end = new Date(newValue as string);
  },
});
</script>

<template>
  <q-dialog v-model="appStore.showCreateOfferDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="offersStore.actOffer._id" class="col-12">
            <h5 class="text-center q-ma-sm">Create offer</h5>

            <q-input
              id="_id"
              v-model="offersStore.actOffer._id"
              counter
              dense
              filled
              label="_id"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!', (v) => v.length == 24 || 'length != 24']"
              type="text"
            />

            <q-select
              id="product_id"
              v-model="offersStore.actOffer.product_id"
              behavior="menu"
              clearable
              emit-value
              filled
              label="Product"
              map-options
              option-label="product_name"
              option-value="_id"
              :options="options"
              :rules="[(v) => v != null || 'Please choose one!']"
              use-input
              @filter="filterFn"
            />

            <q-input
              id="quantity"
              v-model.number="offersStore.actOffer.quantity"
              dense
              filled
              label="Quantity"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="number"
            />

            <q-input
              id="unit"
              v-model="offersStore.actOffer.unit"
              dense
              filled
              label="Unit"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <q-input
              id="unit_price"
              v-model.number="offersStore.actOffer.unit_price"
              dense
              filled
              label="Unit price (Ft)"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="number"
            />

            <q-input
              id="offer_start"
              v-model="offerStartConverter"
              class="q-mb-md"
              clearable
              dense
              filled
              label="Offer start"
              type="date"
              @clear="offersStore.actOffer.offer_start = new Date()"
            />

            <q-input
              id="offer_end"
              v-model="offerEndConverter"
              class="q-mb-md"
              clearable
              dense
              filled
              label="Offer end"
              type="date"
              @clear="offersStore.actOffer.offer_end = null"
            />

            <q-input
              id="picture_url"
              v-model="offersStore.actOffer.picture_url"
              dense
              filled
              label="picture URL (optimal 300x300)"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
             />
              
            <div class="row justify-center q-mb-md">
              <q-img :src="offersStore.actOffer.picture_url" style="width: 150px; height: 150px">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">Cannot load image</div>
                </template>
              </q-img>
            </div>

            <div class="row justify-center q-mb-xl">
              <q-btn class="q-mr-md" color="green" label="Save" no-caps type="submit" />
              <q-btn class="q-mr-md" color="red" label="Reset" no-caps type="reset" />
              <q-btn class="q-mr-md" color="blue" label="Close" no-caps @click="Close()" />
            </div>
            {{ offersStore.actOffer }}
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
