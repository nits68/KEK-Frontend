<script setup lang="ts">
import { Dialog } from 'quasar';
import { useAppStore } from '../../stores/appStore';
import { type IProduct, useProductsStore } from '../../stores/productsStore';
import { type ICategory, useCategoriesStore } from '../../stores/categoriesStore';
import { ref } from 'vue';

const appStore = useAppStore();
const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
// const router = useRouter();

const options = ref([] as ICategory[]);

async function ShowDialog() {
  productsStore.actProduct = { _id: 'dddd00000000000000000000', picture_url: 'none' } as IProduct;
  await categoriesStore.getAllCategories();
  // for filter function in q-select:
  Object.assign(options.value, categoriesStore.categories);
}

function HideDialog() {
  productsStore.actProduct = {} as IProduct;
  categoriesStore.categories = [];
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save changes?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await productsStore.createProduct();
      await productsStore.getAllProducts();
      // appStore.showEditUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Reset() {
  productsStore.actProduct = { ...productsStore.oldProduct } as IProduct;
}

function Close() {
  appStore.showCreateProductsDialog = false;
}

function filterFn(val: string, update: any): void {
  Object.assign(options.value, categoriesStore.categories);
  if (val === '') {
    update(() => {});
    return;
  }

  const value = val.toLowerCase();
  update(() => {
    options.value = options.value.filter((v) => v.category_name!.toLowerCase().indexOf(value) > -1);
  });
}
</script>

<template>
  <q-dialog v-model="appStore.showCreateProductsDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="productsStore.actProduct._id" class="col-12">
            <h5 class="text-center q-ma-sm">Edit product</h5>

            <q-input
              id="_id"
              v-model="productsStore.actProduct._id"
              counter
              dense
              filled
              label="_id"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!', (v) => v.length == 24 || 'length != 24']"
              type="text"
            />

            <q-select
              id="category_id"
              v-model="productsStore.actProduct.category_id"
              clearable
              emit-value
              filled
              label="Category"
              map-options
              option-label="category_name"
              option-value="_id"
              :options="options"
              :rules="[(v) => v != null || 'Please choose one!']"
              use-input
              @filter="filterFn"
            />

            <q-input
              id="product_name"
              v-model="productsStore.actProduct.product_name"
              dense
              filled
              label="product name"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <q-input
              id="product_name"
              v-model="productsStore.actProduct.picture_url"
              dense
              filled
              label="picture URL (optimal 150x150)"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <div class="row justify-center q-mb-md">
              <q-img :src="productsStore.actProduct.picture_url" style="width: 150px; height: 150px">
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
