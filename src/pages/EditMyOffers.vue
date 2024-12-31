<script setup lang="ts">
import { Dialog, useQuasar, type QTableColumn } from 'quasar';
import { useUsersStore } from '../stores/usersStore';
import { onMounted } from 'vue';
import { useAppStore } from '../stores/appStore';
// import { ref } from 'vue';
import EditMyOfferDialog from '../dialogs/offers/EditMyOfferDialog.vue';
import CreateMyOfferDialog from '../dialogs/offers/CreateMyOfferDialog.vue';
import { useI18n } from 'vue-i18n';
import { type IOffer, useOfferssStore } from '../stores/offersStore';
// import { type QTableColumn } from 'quasar';

const usersStore = useUsersStore();
const appStore = useAppStore();
const offersStore = useOfferssStore();

const $q = useQuasar();
const { t } = useI18n();

onMounted(() => {
  if (usersStore.isAdmin || usersStore.isSp) {
    offersStore.getMyOffers();
    appStore.selectedMyOffer = [] as IOffer[];
  } else {
    return;
  }
});

// Selected row(s) -> selection="single" or selection="multiple"
// const selected = ref<IUser[]>([] as IUser[]);

async function deleteMyOffer(): Promise<void> {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like delete the selected offer?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      offersStore.actOffer = { _id: appStore.selectedMyOffer[0]?._id } as IOffer;
      await offersStore.deleteOfferById();
      await offersStore.getMyOffers();
      appStore.selectedProduct = [] as IOffer[];
    })
    .onCancel(() => {
      appStore.selectedOffer = [] as IOffer[];
    });
}

async function editMyOffer(): Promise<void> {
  offersStore.actOffer = { _id: appStore.selectedMyOffer.at(0)?._id } as IOffer;
  appStore.showEditMyOffersDialog = true;
  // selected.value = [] as IUser[];
}

async function createOffer(): Promise<void> {
  appStore.showCreateOfferDialog = true;
}

const columns: QTableColumn[] = [
  {
    name: '_id',
    label: '_id',
    field: (row: IOffer) => row?._id,
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
  if (appStore.selectedMyOffer.length == 0) {
    appStore.selectedMyOffer.push(offer);
  } else {
    if (appStore.selectedMyOffer.at(0)!._id == offer._id) {
      appStore.selectedMyOffer = [];
    } else {
      appStore.selectedMyOffer = [];
      appStore.selectedMyOffer.push(offer);
    }
  }
}
</script>

<template>
  <q-page v-if="usersStore.isAdmin || usersStore.isSp">
    <div class="q-pa-md">
      <q-table
        v-model:selected="appStore.selectedMyOffer"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="offersStore.offers"
        :rows-per-page-options="$q.platform.is.mobile ? [5, 10, 15, 20] : [5, 10, 20, 30, 50, 100, 1000]"
        selection="single"
        :title="t('edit_offers')"
        wrap-cells
        @row-click="selectRow"
      />

      <!-- Button for delete selected record: -->
      <div class="row justify-center q-ma-md">
        <q-btn
          color="red"
          :disable="appStore.selectedMyOffer.length != 1"
          :label="t('delete')"
          no-caps
          @click="deleteMyOffer()"
        />
        <q-btn class="q-ml-md" color="green" :label="t('new')" no-caps @click="createOffer()" />
        <!-- <q-btn class="q-ml-md" color="green" :label="t('new')" no-caps @click="createOffer()" /> -->
        <q-btn
          class="q-ml-md"
          color="primary"
          :disable="appStore.selectedMyOffer.length != 1"
          :label="`${t('edit')}#`"
          no-caps
          @click="editMyOffer()"
        />
      </div>
    </div>
    <!-- {{ appStore.selectedUser }} -->
    {{ offersStore.offers }}
    <!-- {{ offersStore.pagination }} -->
    <!-- {{ appStore.selectedOffer }} -->
    <EditMyOfferDialog />
    <CreateMyOfferDialog />
  </q-page>
</template>

<style lang="scss" scoped>
.myImg {
  border-radius: 10%;
}
</style>
