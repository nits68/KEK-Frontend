<script setup lang="ts">
import { Dialog } from 'quasar';
import { useAppStore } from '../../stores/appStore';
import type { IUser } from '../../stores/usersStore';
import { useUsersStore } from '../../stores/usersStore';
// import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';

const usersStore = useUsersStore();
const appStore = useAppStore();
// const router = useRouter();

async function ShowDialog() {
  await usersStore.getUserById();
}

function HideDialog() {
  usersStore.actUser = {} as IUser;
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save changes?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await usersStore.editUserById();
      await usersStore.getAllUsers();
      // appStore.showEditUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Reset() {
  usersStore.actUser = { ...usersStore.oldUser };
}

function Close() {
  appStore.showEditUserDialog = false;
}
</script>

<template>
  <q-dialog v-model="appStore.showEditUserDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div v-if="usersStore.actUser._id" class="col-12">
            <h5 class="text-center q-ma-sm">Edit user</h5>

            <q-input
              id="name"
              v-model="usersStore.actUser.name"
              dense
              filled
              label="name"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <q-input
              id="email"
              v-model="usersStore.actUser.email"
              dense
              filled
              label="e-mail"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <div class="row justify-start q-mb-md">
              <q-checkbox
                id="email_verified"
                v-model="usersStore.actUser.email_verified"
                dense
                filled
                label="e-mail verified"
              />
              <q-checkbox id="auto_login" v-model="usersStore.actUser.auto_login" filled label="auto login" />
            </div>

            <q-input
              id="password"
              v-model="usersStore.actUser.password"
              class="q-mb-md"
              dense
              filled
              label="password"
              type="text"
            />

            <q-input
              id="mobile_number"
              v-model="usersStore.actUser.mobile_number"
              dense
              filled
              label="mobile number"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <div class="q-pa-sm q-mb-sm rounded-borders bg-grey-2">
              Roles
              <q-option-group
                v-model="usersStore.actUser.roles"
                color="primary"
                dense
                :options="[
                  { label: 'User', value: 'user' },
                  { label: 'Small producer', value: 'sp' },
                  { label: 'Admin', value: 'admin', color: 'red' },
                ]"
                type="checkbox"
              />
            </div>

            <q-input
              id="picture"
              v-model="usersStore.actUser.picture"
              dense
              filled
              label="picture URL or monogram (2 chars)"
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
