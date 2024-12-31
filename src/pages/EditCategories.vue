<script setup lang="ts">
import { Dialog, useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore } from '../stores/usersStore';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useCategoriesStore, type ICategory } from '../stores/categoriesStore';
import CreateCategoryDialog from '../dialogs/categories/CreateCategoryDialog.vue';
import EditCategoryDialog from '../dialogs/categories/EditCategoryDialog.vue';
import { useI18n } from 'vue-i18n';

const usersStore = useUsersStore();
const appStore = useAppStore();
const categoriesStore = useCategoriesStore();
const $q = useQuasar();
const { t } = useI18n();

onMounted(() => {
  if (!usersStore.isAdmin) {
    return;
  }
  appStore.showCreateCategoryDialog = false;
  appStore.showEditCategoriesDialog = false;
  categoriesStore.getAllCategories();
});

async function deleteCategory(): Promise<void> {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like delete the selected category?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      categoriesStore.actCategory = { _id: appStore.selectedCategory[0]?._id } as ICategory;
      await categoriesStore.deleteCategoryById();
      await categoriesStore.getAllCategories();
      appStore.selectedCategory = [] as ICategory[];
    })
    .onCancel(() => {
      appStore.selectedCategory = [] as ICategory[];
    });
}

async function editCategory(): Promise<void> {
  categoriesStore.actCategory = { _id: appStore.selectedCategory.at(0)?._id } as ICategory;
  appStore.showEditCategoriesDialog = true;
}

async function createCategory(): Promise<void> {
  appStore.showCreateCategoryDialog = true;
}

const columns: QTableColumn[] = [
  { name: 'id', label: '_id', field: (row: ICategory) => row?._id, align: 'left', sortable: true },
  {
    name: 'main_category',
    label: 'Main category',
    field: (row: ICategory) => row?.main_category,
    align: 'left',
    sortable: true,
  },
  {
    name: 'category_name',
    label: 'Category name',
    field: (row: ICategory) => row?.category_name,
    align: 'left',
    sortable: true,
  },
];

// Select row(s) in quasar q-table
function selectRow(evt: Event, category: ICategory): void {
  if (appStore.selectedCategory.length == 0) {
    appStore.selectedCategory.push(category);
  } else {
    if (appStore.selectedCategory.at(0)!._id == category._id) {
      appStore.selectedCategory = [];
    } else {
      appStore.selectedCategory = [];
      appStore.selectedCategory.push(category);
    }
  }
}
</script>

<template>
  <q-page v-if="usersStore.isAdmin">
    <div class="q-pa-md">
      <q-table
        v-model:selected="appStore.selectedCategory"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="categoriesStore.categories"
        :rows-per-page-options = "$q.platform.is.mobile ? [5, 10, 15, 0] :  [20, 25, 30, 0]"
        selection="single"
        :title="t('edit_categories')"
        wrap-cells
        @row-click="selectRow"
      />

      <!-- Button for delete selected document: -->
      <div class="row justify-center q-ma-md">
        <q-btn
          color="red"
          :disable="appStore.selectedCategory.length != 1"
          :label="t('delete')"
          no-caps
          @click="deleteCategory()"
        />
        <q-btn class="q-ml-md" color="green" :label="t('new')" no-caps @click="createCategory()" />
        <q-btn
          class="q-ml-md"
          color="primary"
          :disable="appStore.selectedCategory.length != 1"
          :label="t('edit')"
          no-caps
          @click="editCategory()"
        />
      </div>
    </div>
    <EditCategoryDialog />
    <CreateCategoryDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.myImg {
  border-radius: 10%;
}
</style>
