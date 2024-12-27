<!-- Material Design Icons: https://materialdesignicons.com/ -->

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useUsersStore } from '../stores/usersStore';
import { useRouter } from 'vue-router';
import LoginDialog from '../dialogs/LoginDialog.vue';
import ProfileDialog from '../dialogs/ProfileDialog.vue';

import { onMounted } from 'vue';

const appStore = useAppStore();
const usersStore = useUsersStore();
const router = useRouter();

const showMenuBar = ref(true);
const showLeftDrawer = ref(true);
const showRightDrawer = ref(true);
const showStatusBar = ref(true);

onMounted(() => {
  if (!usersStore.loggedUser) {
    usersStore.autoLogin();
  }
  appStore.showProfileDialog = false;
});
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="hHh LpR fFf">
      <!-- Header: -->
      <q-header v-model="showMenuBar" class="text-left bg-blue-5" elevated reveal>
        <!-- Menu bar: -->
        <q-toolbar>
          <q-btn v-if="usersStore.isSp" dense flat icon="mdi-menu" round @click="showLeftDrawer = !showLeftDrawer" />
          <q-toolbar-title class="my-title" :shrink="true" style="cursor: pointer" @click="router.push({ path: '/' })">
            <q-avatar>
              <img src="../assets/Jedlik_small.png" />
            </q-avatar>
            KEK
          </q-toolbar-title>
          <!-- <q-btn
            :class="{ active: router.currentRoute.value.path === '/' }"
            clickable
            flat
            icon="mdi-home"
            label="Home"
            no-caps
            to="/"
          /> -->

          <q-toolbar-title class="my-title" />

          <q-btn
            :class="{ active: appStore.showLoginDialog }"
            clickable
            flat
            icon="mdi-login"
            :label="usersStore.loggedUser ? 'Logout' : 'Login/Register'"
            no-caps
            @click="appStore.showLoginDialog = true"
          />

          <q-btn
            v-if="usersStore.loggedUser && usersStore.loggedUser.picture!.length > 2"
            color="primary"
            round
            @click="appStore.showProfileDialog = true"
          >
            <q-avatar size="36px">
              <q-img :src="usersStore.loggedUser.picture as string" />
            </q-avatar>
          </q-btn>
          <q-btn
            v-if="usersStore.loggedUser && usersStore.loggedUser.picture!.length <= 2"
            class="q-ma-sm"
            color="primary"
            round
            @click="appStore.showProfileDialog = true"
          >
            <q-avatar size="36px">
              {{ usersStore.loggedUser.picture?.toUpperCase() }}
            </q-avatar>
          </q-btn>

          <q-btn
            v-if="usersStore.isAdmin"
            dense
            flat
            icon="mdi-menu"
            round
            @click="showRightDrawer = !showRightDrawer"
          />
        </q-toolbar>
      </q-header>

      <!-- Left drawer: -->
      <q-drawer v-if="usersStore.isSp" v-model="showLeftDrawer" bordered :breakpoint="600" :width="200">
        <q-scroll-area class="fit bg-blue-1">
          <div class="q-ma-sm text-center">Small producer's drawer!</div>
        </q-scroll-area>
      </q-drawer>

      <!-- Right drawer: -->
      <q-drawer
        v-if="usersStore.isAdmin"
        v-model="showRightDrawer"
        bordered
        :breakpoint="800"
        class="bg-blue-1"
        side="right"
        :width="200"
      >
        <q-scroll-area class="fit">
          <div class="q-ma-sm text-center">Admin's drawer!</div>
          <q-btn
            align="left"
            class="full-width q-ma-xs"
            :class="{ active: router.currentRoute.value.path === '/editusers' }"
            flat
            icon="mdi-table"
            label="Edit users"
            no-caps
            to="/editusers"
          />
        </q-scroll-area>
      </q-drawer>

      <!-- Status bar: -->
      <q-footer v-model="showStatusBar" class="bg-blue-5" elevated reveal>
        <q-toolbar>
          <q-toolbar-title class="text-center my-title"
            >Kisalföld eKosár - KEK ({{ appStore.currentYear }})</q-toolbar-title
          >
        </q-toolbar>
      </q-footer>

      <LoginDialog email="esze.gabor@students.jedlik.eu" password="gabor" />
      <ProfileDialog />

      <!-- Main container (DON'T DELETE!) -->
      <q-page-container id="container">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="scss">
.active {
  background-color: #44a5f1;
  color: yellow;
}

.my-title {
  font-size: 10px;
  @media (min-width: 400px) {
    font-size: calc(10px + 0.5vw);
  }
  @media (min-width: 800px) {
    font-size: calc(14px + 0.5vw);
  }
  @media (min-width: 1200px) {
    font-size: calc(18px + 0.5vw);
  }
}
</style>
