<script setup lang="ts">
import { Dialog, useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore } from '../stores/usersStore';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
// import { ref } from 'vue';
import EditOfferDialog from '../dialogs/offers/EditOfferDialog.vue';
// import CreateOfferDialog from '../dialogs/offers/CreateOfferDialog.vue';
import { useI18n } from 'vue-i18n';
import { type IOffer, useOfferssStore } from '../stores/offersStore';
// import { type QTableColumn } from 'quasar';

const usersStore = useUsersStore();
const appStore = useAppStore();
const offersStore = useOfferssStore();

const $q = useQuasar();
const { t } = useI18n();

function onRequest(props: any) {
  if (props.pagination) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    offersStore.pagination.page = page as number;
    offersStore.pagination.rowsPerPage = rowsPerPage as number;
    offersStore.pagination.sortBy = sortBy as string;
    offersStore.pagination.descending = descending as boolean;

    offersStore.getPaginatedOffers(); // get offers
  }
}

onMounted(() => {
  if (!usersStore.isAdmin) {
    return;
  }
  offersStore.pagination.rowsPerPage = $q.platform.is.mobile ? 5 : 20;
  onRequest({ pagination: offersStore.pagination });
  appStore.selectedOffer = [] as IOffer[];
  // offersStore.getPaginatedOffers();
});

// Selected row(s) -> selection="single" or selection="multiple"
// const selected = ref<IUser[]>([] as IUser[]);

async function deleteOffer(): Promise<void> {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like delete the selected offer?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      offersStore.actOffer = { _id: appStore.selectedOffer[0]?._id } as IOffer;
      await offersStore.deleteOfferById();
      await offersStore.getPaginatedOffers();
      appStore.selectedProduct = [] as IOffer[];
    })
    .onCancel(() => {
      appStore.selectedOffer = [] as IOffer[];
    });
}

async function editOffer(): Promise<void> {
  offersStore.actOffer = { _id: appStore.selectedOffer.at(0)?._id } as IOffer;
  appStore.showEditOffersDialog = true;
  // selected.value = [] as IUser[];
}

async function filterUpdate() {
  // Clear button (x) set filter to null
  if (!appStore.offersFilter) {
    appStore.offersFilter = '';
  }
  await offersStore.getPaginatedOffers();
}

const columns: QTableColumn[] = [
  { name: 'id', label: '_id', field: (row: IOffer) => row?._id, align: 'left', sortable: true },
  {
    name: 'offer_name',
    label: 'Offer name',
    field: (row: any) => row?.offer?.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'offer_start',
    label: 'Offer start',
    field: (row: IOffer) => row?.offer_start?.toString().substring(0, 10),
    align: 'left',
    sortable: true,
  },
  {
    name: 'offer_end',
    label: 'Offer end#',
    field: (row: IOffer) => (row?.offer_end == null ? 'null' : row?.offer_end?.toString().substring(0, 10)),
    align: 'left',
    sortable: true,
  },
  {
    name: 'quantity',
    label: 'Quantity#',
    field: (row: IOffer) => row?.quantity,
    align: 'left',
    sortable: true,
  },
  {
    name: 'unit',
    label: 'Unit',
    field: (row: IOffer) => row?.unit,
    align: 'left',
    sortable: true,
  },
  {
    name: 'unit_price',
    label: 'Unit price',
    field: (row: IOffer) => row?.unit_price,
    align: 'left',
    sortable: true,
  },
  {
    name: 'picture_url',
    label: 'Picture URL#',
    field: (row: IOffer) => row?.picture_url,
    align: 'left',
    sortable: true,
  },
  {
    name: 'product_name',
    label: 'Product name',
    field: (row: any) => row?.product?.product_name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'category_name',
    label: 'Category name',
    field: (row: any) => row?.category?.category_name,
    align: 'left',
    sortable: true,
  },
];

// Select row(s) in quasar q-table
function selectRow(evt: Event, offer: IOffer): void {
  if (appStore.selectedOffer.length == 0) {
    appStore.selectedOffer.push(offer);
  } else {
    if (appStore.selectedOffer.at(0)!._id == offer._id) {
      appStore.selectedOffer = [];
    } else {
      appStore.selectedOffer = [];
      appStore.selectedOffer.push(offer);
    }
  }
}
</script>

<template>
  <q-page v-if="usersStore.isAdmin">
    <div class="q-pa-md">
      <q-input
        v-model="appStore.offersFilter"
        clearable
        dense
        filled
        label="Filter"
        type="text"
        @update:model-value="filterUpdate()"
      />
      <q-table
        v-model:pagination="offersStore.pagination"
        v-model:selected="appStore.selectedOffer"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="offersStore.offers"
        :rows-per-page-options="$q.platform.is.mobile ? [5, 10, 15, 20] : [5, 10, 20, 30, 50, 100, 1000]"
        selection="single"
        :title="t('edit_offers')"
        wrap-cells
        @request="onRequest"
        @row-click="selectRow"
      />

      <div class="row justify-center q-ma-md">
        <q-btn
          color="red"
          :disable="appStore.selectedOffer.length != 1"
          :label="t('delete')"
          no-caps
          @click="deleteOffer()"
        />
        <q-btn
          class="q-ml-md"
          color="primary"
          :disable="appStore.selectedOffer.length != 1"
          :label="`${t('edit')}#`"
          no-caps
          @click="editOffer()"
        />
      </div>
    </div>
    <!-- {{ appStore.selectedUser }} -->
    <!-- {{ offersStore.offers }} -->
    <!-- {{ offersStore.pagination }} -->
    <!-- {{ appStore.selectedOffer }} -->
    <EditOfferDialog />
    <CreateOfferDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.myImg {
  border-radius: 10%;
}
</style>
