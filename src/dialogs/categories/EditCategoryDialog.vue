<script setup lang="ts">
import { Dialog } from 'quasar';
import { useAppStore } from '../../stores/appStore';
// import { useUsersStore } from '../../stores/usersStore';
import { useCategoriesStore, type ICategory } from '../../stores/categoriesStore';
// import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

// const usersStore = useUsersStore();
const appStore = useAppStore();
const categoriesStore = useCategoriesStore();
// const router = useRouter();

function ShowDialog() {
  categoriesStore.getCategoryById();
}

function HideDialog() {
  categoriesStore.actCategory = {} as ICategory;
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save changes?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await categoriesStore.editCategoryById();
      await categoriesStore.getAllCategories();
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Reset() {
  categoriesStore.actCategory = { ...categoriesStore.oldCategory };
}

function Close() {
  appStore.showEditCategoryDialog = false;
}
</script>

<template>
  <q-dialog v-model="appStore.showEditCategoryDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="categoriesStore.actCategory._id" class="col-12">
            <h5 class="text-center q-ma-sm">Edit category</h5>

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
