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
  await offersStore.getOfferById();
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
    message: 'Would you like to save changes?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await offersStore.editOfferById();
      await offersStore.getPaginatedOffers();
      // appStore.showEditUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Reset() {
  offersStore.actOffer = { ...offersStore.oldOffer } as IOffer;
}

function Close() {
  appStore.showEditMyOffersDialog = false;
}


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
  <q-dialog v-model="appStore.showEditMyOffersDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="offersStore.actOffer._id" class="col-12">
            <h5 class="text-center q-ma-sm">Edit my offer</h5>
            
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
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
