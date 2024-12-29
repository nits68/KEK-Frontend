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
  await productsStore.getProductById();
  await categoriesStore.getAllCategories();
  // for filter function:
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
      await productsStore.editProductById();
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
  appStore.showEditProductsDialog = false;
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
  <q-dialog v-model="appStore.showEditProductsDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="productsStore.actProduct._id" class="col-12">
            <h5 class="text-center q-ma-sm">Edit product</h5>

            <q-select
              id="category_id"
              v-model="productsStore.actProduct.category_id"
              clearable
              emit-value
              filled
              label="Category name"
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
