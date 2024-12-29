<script setup lang="ts">
import { Dialog, useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore } from '../stores/usersStore';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
// import { ref } from 'vue';
import EditProductDialog from '../dialogs/products/EditProductDialog.vue';
import CreateProductDialog from '../dialogs/products/CreateProductDialog.vue';
import { useProductsStore, type IProduct } from '../stores/productsStore';
import { useI18n } from 'vue-i18n';
// import { type QTableColumn } from 'quasar';

const usersStore = useUsersStore();
const appStore = useAppStore();
const productsStore = useProductsStore();
const $q = useQuasar();
const { t } = useI18n();

onMounted(() => {
  if (!usersStore.isAdmin) {
    return;
  }
  productsStore.getAllProducts();
});

// Selected row(s) -> selection="single" or selection="multiple"
// const selected = ref<IUser[]>([] as IUser[]);

async function deleteProduct(): Promise<void> {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like delete the selected product?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      productsStore.actProduct = { _id: appStore.selectedProduct[0]?._id } as IProduct;
      await productsStore.deleteProductById();
      await productsStore.getAllProducts();
      appStore.selectedProduct = [] as IProduct[];
    })
    .onCancel(() => {
      appStore.selectedProduct = [] as IProduct[];
    });
}

async function editProduct(): Promise<void> {
  productsStore.actProduct = { _id: appStore.selectedProduct.at(0)?._id } as IProduct;
  appStore.showEditProductsDialog = true;
  // selected.value = [] as IUser[];
}

async function createProduct(): Promise<void> {
  appStore.showCreateProductsDialog = true;
  // s.many.document = { id: selected.value[0].id };
  // usersStore.document = { id: s.app.selected[0].id } as IMany;
  // await s.ManyDeleteById();
  // await s.ManyGetAll();
  // s.app.selected = [];
}

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.productsFilter) {
    appStore.productsFilter = '';
  }
  if (appStore.productsFilter.length > 0) {
    await productsStore.getProductsByFilter();
  } else {
    await productsStore.getAllProducts();
  }
}

const columns: QTableColumn[] = [
  { name: 'id', label: '_id', field: (row: IProduct) => row?._id, align: 'left', sortable: true },
  { name: 'product_name', label: 'Product name', field: (row: IProduct) => row?.product_name, align: 'left', sortable: true },
  { name: 'picture_url', label: 'Picture url', field: (row: IProduct) => row?.picture_url?.slice(0,30) + '...', align: 'left', sortable: true },
  { name: 'main_category', label: 'Main category', field: (row: IProduct) => row?.category?.main_category, align: 'left', sortable: true },
  { name: 'category_name', label: 'Category name', field: (row: IProduct) => row?.category?.category_name, align: 'left', sortable: true },

];

// Select row(s) in quasar q-table
function selectRow(evt: Event, user: IProduct): void {
  if (appStore.selectedProduct.length == 0) {
    appStore.selectedProduct.push(user);
  } else {
    if (appStore.selectedProduct.at(0)!._id == user._id) {
      appStore.selectedProduct = [];
    } else {
      appStore.selectedProduct = [];
      appStore.selectedProduct.push(user);
    }
  }
}
</script>

<template>
  <q-page v-if="usersStore.isAdmin">
    <div class="q-pa-md">
      <q-input
        v-model="appStore.productsFilter"
        clearable
        dense
        filled
        label="Filter in product_name, category.category_name and category.main_category"
        type="text"
        @update:model-value="filterUpdate()"
      />
      <q-table
        v-model:selected="appStore.selectedProduct"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="productsStore.products"
        :rows-per-page-options="$q.platform.is.mobile ? [5, 10, 15, 0] : [20, 25, 30, 0]"
        selection="single"
        :title="t('edit_products')"
        wrap-cells
        @row-click="selectRow"
      />

      <!-- Button for delete selected record: -->
      <div class="row justify-center q-ma-md">
        <q-btn color="red" :disable="appStore.selectedProduct.length != 1" :label="t('delete')" no-caps @click="deleteProduct()" />
        <q-btn class="q-ml-md" color="green" :label="t('new')" no-caps @click="createProduct()" />
        <q-btn
          class="q-ml-md"
          color="primary"
          :disable="appStore.selectedProduct.length != 1"
          :label="t('edit')"
          no-caps
          @click="editProduct()"
        />
      </div>
    </div>
    <!-- {{ appStore.selectedUser }} -->
    <!-- {{ productsStore.products }} -->
    <EditProductDialog />
    <CreateProductDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.myImg {
  border-radius: 10%;
}
</style>
