<script setup lang="ts">
import { Dialog } from 'quasar';
import { useAppStore } from '../../stores/appStore';
import { useCategoriesStore, type ICategory } from '../../stores/categoriesStore';

const appStore = useAppStore();
const categoriesStore = useCategoriesStore();

function ShowDialog() {
  categoriesStore.actCategory = {
    _id: 'cccc00000000000000000000',
    category_name: '',
    main_category: '',
  };
}

function HideDialog() {
  categoriesStore.actCategory = {} as ICategory;
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save new user?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await categoriesStore.createCategory();
      await categoriesStore.getAllCategories();
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      //   appStore.showCreateUserDialog = false;
    });
}

function Reset() {
  categoriesStore.actCategory = {
    _id: 'cccc00000000000000000000',
    category_name: '',
    main_category: '',
  };
}

function Close() {
  appStore.showCreateCategoryDialog = false;
}
</script>

<template>
  <q-dialog v-model="appStore.showCreateCategoryDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div class="col-12">
            <h5 class="text-center q-ma-sm">Add new category</h5>

            <q-input
              id="_id"
              v-model="categoriesStore.actCategory._id"
              counter
              dense
              filled
              label="_id (Exact 24 pieces of hex characters)"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!', (v) => v.length == 24 || 'length != 24']"
              type="text"
            />

            <q-input
              id="mainCategory"
              v-model="categoriesStore.actCategory.main_category"
              dense
              filled
              label="Main category"
              lazy-rules
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <q-input
              id="category_name"
              v-model="categoriesStore.actCategory.category_name"
              dense
              filled
              label="Category name"
              lazy-rules
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <div class="row justify-center q-mb-xl">
              <q-btn class="q-mr-md" color="green" label="Save" no-caps type="submit" />
              <q-btn class="q-mr-md" color="red" label="Reset" no-caps type="reset" />
              <q-btn class="q-mr-md" color="blue" label="Close" no-caps @click="Close()" />
            </div>
            <!-- {{ usersStore.actUser }} -->
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
