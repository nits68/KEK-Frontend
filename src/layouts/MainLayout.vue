<!-- Material Design Icons: https://materialdesignicons.com/ -->

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useUsersStore } from '../stores/usersStore';
import { useRouter } from 'vue-router';
import LoginDialog from '../dialogs/users/LoginDialog.vue';
import ProfileDialog from '../dialogs/users/ProfileDialog.vue';
import { useI18n } from 'vue-i18n';

import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

const appStore = useAppStore();
const usersStore = useUsersStore();
const router = useRouter();
const $q = useQuasar();

const showMenuBar = ref(true);
const showLeftDrawer = ref(!$q.platform.is.mobile);
const showRightDrawer = ref(!$q.platform.is.mobile);
const showStatusBar = ref(!$q.platform.is.mobile);

const { t } = useI18n();
const { locale } = useI18n({ useScope: 'global' });
locale.value = 'hu'; // set the default language

function toggleLanguage() {
  locale.value = locale.value == 'hu' ? 'en' : 'hu';
}

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
          <q-btn
            v-if="usersStore.isUser"
            dense
            flat
            icon="mdi-menu"
            round
            @click="showLeftDrawer = !showLeftDrawer"
          />
          <q-toolbar-title v-if="!$q.platform.is.mobile" :shrink="true" style="cursor: pointer" @click="router.push({ path: '/' })">
            <q-avatar >
              <img src="../assets/kek_basket_small.png" />
            </q-avatar>
          </q-toolbar-title>
         
          <q-space />

          <q-btn
            v-if="!$q.platform.is.mobile"
            :class="{ active: appStore.showLoginDialog }"
            clickable
            flat
            :icon="usersStore.loggedUser ? 'mdi-logout' : 'mdi-login'"
            :label="usersStore.loggedUser ? t('logout') : `${t('login')}/${t('registration')}`"
            no-caps
            @click="appStore.showLoginDialog = true"
          />
          <q-btn
            v-else
            :class="{ active: appStore.showLoginDialog }"
            clickable
            flat
            icon="mdi-login"
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

          <q-btn flat icon="mdi-comment-text-multiple" @click="toggleLanguage">
            <q-badge color="red" floating :label="locale" />
          </q-btn>
          <q-btn flat icon="mdi-theme-light-dark" @click="$q.dark.toggle" />

          <q-btn v-if="usersStore.isUser" flat icon="mdi-basket">
            <q-badge color="red" floating :label="appStore.basketCounter" />
          </q-btn>

          <q-btn
            v-if="usersStore.isSp || usersStore.isAdmin"
            dense
            flat
            icon="mdi-menu"
            round
            @click="showRightDrawer = !showRightDrawer"
          />
        </q-toolbar>
      </q-header>

      <!-- Left drawer: -->
      <q-drawer
        v-if="usersStore.isUser"
        v-model="showLeftDrawer"
        bordered
        :breakpoint="500"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        show-if-above
        :width="200"
      >
        <q-scroll-area class="fit">
          <div class="q-ma-sm text-center text-italic">for users</div>

          <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/' }"
              flat
              icon="mdi-offer"
              :label="t('act_offers')"
              no-caps
              to="/"
            />

          <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/cart' }"
              flat
              icon="mdi-basket-plus"
              :label="t('cart')"
              no-caps
              to="/cart"
            />

          <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/myorders' }"
              flat
              icon="mdi-cart-arrow-down"
              :label="t('myorders')"
              no-caps
              to="/myorders"
            />
        </q-scroll-area>
      </q-drawer>

      <!-- Right drawer: -->
      <q-drawer
        v-if="usersStore.isAdmin || usersStore.isSp"
        v-model="showRightDrawer"
        bordered
        :breakpoint="800"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        show-if-above
        side="right"
        :width="200"
      >
        <q-scroll-area class="fit">
          <div v-if="usersStore.isSp">
            <div class="q-ma-sm text-center text-italic">for small producers</div>

            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/editmyoffers' }"
              flat
              icon="mdi-offer"
              :label="t('edit_my_offers')"
              no-caps
              to="/editmyoffers"
            />

            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/orders' }"
              flat
              icon="mdi-basket-minus"
              :label="t('orders')"
              no-caps
              to="/orders"
            />
          </div>
          <q-separator />
          <div v-if="usersStore.isAdmin">
            <div class="q-ma-sm text-center text-italic">for admins</div>

            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/editusers' }"
              flat
              icon="mdi-account-multiple"
              :label="t('edit_users')"
              no-caps
              to="/editusers"
            />
            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/editcategories' }"
              flat
              icon="mdi-shape"
              :label="t('edit_categories')"
              no-caps
              to="/editcategories"
            />

            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/editproducts' }"
              flat
              icon="mdi-storefront-outline"
              :label="t('edit_products')"
              no-caps
              to="/editproducts"
            />
            <q-btn
              align="left"
              class="full-width q-ma-xs"
              :class="{ active: router.currentRoute.value.path === '/editoffers' }"
              flat
              icon="mdi-offer"
              :label="t('edit_offers')"
              no-caps
              to="/editoffers"
            />
          </div>
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

</style>
