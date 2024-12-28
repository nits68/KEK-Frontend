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
  if (usersStore.loggedUser) {
    usersStore.actUser = { _id: usersStore.loggedUser._id } as IUser;
    await usersStore.getUserById();
    usersStore.actUser.password = '';
  }
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
      await usersStore.editProfileById();
      await usersStore.getUserById();
      usersStore.loggedUser = usersStore.actUser;
      // appStore.showEditUserDialog = false;
    })
    .onCancel(() => {
      //   router.push('/'); // ???
      // appStore.showEditUserDialog = false;
    });
}

function Close() {
  appStore.showProfileDialog = false;
}
</script>

<template>
  <q-dialog v-model="appStore.showProfileDialog" persistent @hide="HideDialog()" @show="ShowDialog()">
    <q-card class="q-pa-sm" style="width: 60vw; min-width: 300px">
      <q-form @submit="Submit()">
        <div class="row">
          <div v-if="usersStore.loggedUser" class="col-12 q-gutter-y-sm">
            <h5 class="text-center q-ma-sm">Edit profile</h5>

            <q-input
              id="name"
              v-model="usersStore.actUser.name"
              class="bg-green-2"
              dense
              filled
              label="name"
              type="text"
            />

            <q-input
              id="email"
              v-model="usersStore.actUser.email"
              dense
              :disable="true"
              filled
              label="e-mail"
              type="text"
            />

            <div class="row justify-start q-mb-md">
              <q-checkbox
                id="email_verified"
                v-model="usersStore.actUser.email_verified"
                dense
                :disable="true"
                filled
                label="e-mail verified"
              />
              <q-checkbox
                id="auto_login"
                v-model="usersStore.actUser.auto_login"
                color="green"
                filled
                keep-color
                label="auto login"
              />
            </div>

            <q-input
              id="password"
              v-model="usersStore.actUser.password"
              class="bg-green-2"
              dense
              filled
              label="password"
              type="text"
            />

            <q-input
              id="mobile_number"
              v-model="usersStore.actUser.mobile_number"
              class="bg-green-2"
              dense
              filled
              label="mobile number"
              type="text"
            />

            <div class="q-pa-sm q-mb-sm rounded-borders bg-grey-2">
              Roles
              <q-option-group
                v-model="usersStore.actUser.roles"
                color="primary"
                dense
                :disable="true"
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
              class="bg-green-2"
              dense
              filled
              label="picture URL or monogram (2 chars)"
              type="text"
            />

            <div class="row justify-center q-mb-xl">
              <q-btn class="q-mr-md" color="green" label="Save" no-caps type="submit" />
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
