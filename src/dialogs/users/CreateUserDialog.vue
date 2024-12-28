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

function ShowDialog() {
  usersStore.actUser = {
    _id: 'aaaa00000000000000000000',
    name: '',
    email: '',
    email_verified: false,
    auto_login: true,
    password: '',
    mobile_number: '+36',
    roles: ['user'],
    picture: '',
  };
}

function HideDialog() {
  usersStore.actUser = {} as IUser;
}

function Submit() {
  Dialog.create({
    title: 'Confirm',
    message: 'Would you like to save new user?',
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      await usersStore.createUser();
      await usersStore.getAllUsers();
      //   appStore.showCreateUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      //   appStore.showCreateUserDialog = false;
    });
}

function Reset() {
  usersStore.actUser = {} as IUser;
}

function Close() {
  appStore.showCreateUserDialog = false;
}
</script>

<template>
  <q-dialog v-model="appStore.showCreateUserDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @reset="Reset()" @submit="Submit()">
        <div class="row">
          <div class="col-12">
            <h5 class="text-center q-ma-sm">Add new user</h5>

            <q-input
              id="_id"
              v-model="usersStore.actUser._id"
              counter
              dense
              filled
              label="_id (Exact 24 pieces of hex characters)"
              :rules="[(v) => (v != null && v != '') || 'Please fill in!', (v) => v.length == 24 || 'length != 24']"
              type="text"
            />

            <q-input
              id="name"
              v-model="usersStore.actUser.name"
              dense
              filled
              label="name"
              lazy-rules
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="text"
            />

            <q-input
              id="email"
              v-model="usersStore.actUser.email"
              dense
              filled
              label="e-mail"
              lazy-rules
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
              type="email"
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
              dense
              filled
              label="password"
              lazy-rules
              :rules="[(v) => (v != null && v != '') || 'Please fill in!']"
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

            <div class="q-pa-sm rounded-borders bg-grey-2">
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
              class="q-mt-md"
              dense
              filled
              label="picture URL or monogram (2 chars)"
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
