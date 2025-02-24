<script setup lang="ts">
import { Dialog, useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore, type IUser } from '../stores/usersStore';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
// import { ref } from 'vue';
import EditUserDialog from '../dialogs/users/EditUserDialog.vue';
import CreateUserDialog from '../dialogs/users/CreateUserDialog.vue';
import { useI18n } from 'vue-i18n';

const usersStore = useUsersStore();
const appStore = useAppStore();
const $q = useQuasar();
const { t } = useI18n();

onMounted(async () => {
  if (!usersStore.isAdmin) {
    return;
  }
  try {
    await usersStore.getAllUsers();
    appStore.selectedUser = [] as IUser[];
  } catch (error) {
    console.error('Error in onMounted():', error);
  }
});

// Selected row(s) -> selection="single" or selection="multiple"
// const selected = ref<IUser[]>([] as IUser[]);

function deleteUser(): void {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like delete the selected user?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      usersStore.actUser = { _id: appStore.selectedUser[0]?._id } as IUser;
      await usersStore.deleteUserById();
      await usersStore.getAllUsers();
      appStore.selectedUser = [] as IUser[];
    })
    .onCancel(() => {
      appStore.selectedUser = [] as IUser[];
    });
}

function editUser(): void {
  usersStore.actUser = { _id: appStore.selectedUser.at(0)?._id } as IUser;
  appStore.showEditUserDialog = true;
  // selected.value = [] as IUser[];
}

function createUser(): void {
  appStore.showCreateUserDialog = true;
  // s.many.document = { id: selected.value[0].id };
  // usersStore.document = { id: s.app.selected[0].id } as IMany;
  // await s.ManyDeleteById();
  // await s.ManyGetAll();
  // s.app.selected = [];
}

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.usersFilter) {
    appStore.usersFilter = '';
  }
  if (appStore.usersFilter.length > 0) {
    await usersStore.getUsersByFilter();
  } else {
    await usersStore.getAllUsers();
  }
}

// async function filterUpdate() {
// Clear button (x) set filter to null
// if (s.app.filter) {
//   s.app.filter = '';
// }
// if (s.app.filter.length > 0) {
//   await s.ManyFilter();
// } else {
//   await s.ManyGetAll();
// }
// }

// Columns def template:
// const cols: QTableColumn[] = [
//   { name: "", label: "", field: "", align:"center" },
// ];

/*  Slot for table column
    <template #body-cell-fieldName="props">
      <q-td :props="props">
      </q-td>
    </template>
  */

// JSON-server and MongoDb-populate() return field(s) with object type from the "1"-side:
// field: (row: any) => row?.category?.categoryNameField,

// sort with: sortable: true
// align with (default right): align: "center"
const columns: QTableColumn[] = [
  { name: 'name', label: 'name*#', field: (row: IUser) => row?.name, align: 'left', sortable: true },
  { name: 'email', label: 'e-mail*#', field: (row: IUser) => row?.email, align: 'left', sortable: true },
  {
    name: 'email_verified',
    label: 'e-mail verified#',
    field: (row: IUser) => row?.email_verified,
    align: 'left',
    sortable: true,
  },
  {
    name: 'mobile_number',
    label: 'mobile number#',
    field: (row: IUser) => row?.mobile_number,
    align: 'left',
    sortable: true,
  },
  {
    name: 'roles',
    label: 'Roles#',
    field: (row: IUser) => row?.roles?.map((x) => x).join(' '),
    align: 'left',
    sortable: true,
  },
  { name: 'id', label: '_id', field: (row: IUser) => row?._id, align: 'left', sortable: true },
  {
    name: 'picture',
    label: 'Monogram or avatar URL#',
    field: (row: IUser) => (row.picture!.length > 2 ? row.picture!.slice(0, 30) + '...' : row.picture),
    align: 'left',
    sortable: true,
    style: 'width: 300px',
  },
];

// Select row(s) in quasar q-table
function selectRow(evt: Event, user: IUser): void {
  if (appStore.selectedUser.length == 0) {
    appStore.selectedUser.push(user);
  } else {
    if (appStore.selectedUser.at(0)!._id == user._id) {
      appStore.selectedUser = [];
    } else {
      appStore.selectedUser = [];
      appStore.selectedUser.push(user);
    }
  }
}
</script>

<template>
  <q-page v-if="usersStore.isAdmin">
    <div class="q-pa-md">
      <q-input
        v-model="appStore.usersFilter"
        clearable
        dense
        filled
        label="Filter*"
        type="text"
        @update:model-value="filterUpdate()"
      />
      <q-table
        v-model:selected="appStore.selectedUser"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="usersStore.users"
        :rows-per-page-options="$q.platform.is.mobile ? [5, 10, 15, 0] : [20, 25, 30, 0]"
        selection="single"
        :title="t('edit_users')"
        wrap-cells
        @row-click="selectRow"
      />

      <!-- Button for delete selected record: -->
      <div class="row justify-center q-ma-md">
        <q-btn
          color="red"
          :disable="appStore.selectedUser.length != 1"
          :label="t('delete')"
          no-caps
          @click="deleteUser()"
        />
        <q-btn class="q-ml-md" color="green" :label="t('new')" no-caps @click="createUser()" />
        <q-btn
          class="q-ml-md"
          color="primary"
          :disable="appStore.selectedUser.length != 1"
          :label="`${t('edit')}#`"
          no-caps
          @click="editUser()"
        />
      </div>
    </div>
    <!-- {{ appStore.selectedUser }} -->
    <EditUserDialog />
    <CreateUserDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.myImg {
  border-radius: 10%;
}
</style>
