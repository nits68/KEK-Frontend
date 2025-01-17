<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue';
import { useUsersStore } from '../../stores/usersStore';
import { useAppStore } from '../../stores/appStore';
import LoginHelper from './LoginHelper';
import ValidPassword from '../../components/ValidPassword.vue';
import { googleTokenLogin, type CallbackTypes } from 'vue3-google-login';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface IProps {
  email?: string;
  password?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  email: 'admin@jedlik.eu', // set value of optional prop
  password: 'admin',
});

const usersStore = useUsersStore();
const appStore = useAppStore();
const router = useRouter();

const { t } = useI18n();

const anyLoggedUser = computed(() => (usersStore.getLoggedUser ? true : false));

interface IReactiveData {
  email: string;
  password: string;
  password_ok: boolean;
  isPwd: boolean;
}

const r = reactive<IReactiveData>({
  email: props.email,
  password: props.password,
  password_ok: true,
  isPwd: true,
});

watchEffect(() => (r.email = usersStore.loggedUser ? (usersStore.loggedUser.email as string) : props.email));

function isValidEmail(email: string): boolean | string {
  return LoginHelper.IsValidEmail(email);
}

function LogInOut() {
  if (!anyLoggedUser.value) {
    usersStore.loginUser({
      email: r.email,
      password: r.password,
    });
  } else {
    usersStore.logOut();
  }
}

function Register() {
  if (!anyLoggedUser.value) {
    usersStore.registerUser({
      email: r.email,
      password: r.password,
    });
  }
}

function dialogShow() {
  if (usersStore.loggedUser) {
    r.email = usersStore.loggedUser.email as string;
  } else {
    r.email = props.email;
  }
}

function dialogHide() {
  router.push('/');
}

function isValidPassword(result: boolean): void {
  r.password_ok = result;
}

function loginRegisterGoogle() {
  googleTokenLogin().then((response: CallbackTypes.TokenPopupResponse) => {
    usersStore.loginRegisterWithGoogle(response.access_token);
  });
}
</script>

<template>
  <q-dialog
    v-model="appStore.showLoginDialog"
    persistent
    transition-show="rotate"
    @hide="dialogHide()"
    @show="dialogShow()"
  >
    <q-card style="width: 100%">
      <q-form>
        <div class="row flex-center">
          <div class="col-xs-12 col-sm-6">
            <q-card-section>
              <q-input
                v-model="r.email"
                data-test="QInputEmail"
                :disable="anyLoggedUser"
                filled
                :label="`E-mail ${t('address')}`"
                :rules="[(v) => (v != null && v != '') || 'Please fill in!', isValidEmail]"
                type="text"
              />
            </q-card-section>

            <q-card-section v-if="!anyLoggedUser">
              <q-input
                v-model="r.password"
                autocomplete="on"
                data-test="QInputPassword"
                filled
                :label="t('password')"
                :rules="[(v) => (v != null && v != '') || 'Please fill in!', () => r.password_ok || 'See red rules!']"
                :type="r.isPwd ? 'password' : 'text'"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    :name="r.isPwd ? 'visibility_off' : 'visibility'"
                    @click="r.isPwd = !r.isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-card-section v-if="!anyLoggedUser" class="no-padding">
              <div class="column">
                <ValidPassword :password="r.password" @password_changed="isValidPassword" />
              </div>
            </q-card-section>
          </div>
        </div>

        <q-card-actions align="center" class="text-primary q-mb-xl">
          <q-btn
            class="shadow-10 q-mr-sm q-mb-md"
            color="green"
            data-test="btnLoginLogoutDialog"
            :label="anyLoggedUser ? t('logout') : t('login')"
            no-caps
            type="button"
            @click="LogInOut()"
          />

          <q-btn
            v-if="!anyLoggedUser"
            class="shadow-10 q-mr-sm q-mb-md"
            color="red"
            data-test="btnRegister"
            :disable="!r.password_ok"
            :label="t('registration')"
            no-caps
            type="button"
            @click="Register()"
          />

          <q-btn
            v-if="!anyLoggedUser"
            class="shadow-10 q-mr-sm q-mb-md"
            color="blue"
            data-test="btnGoogle"
            label="Google"
            no-caps
            @click="loginRegisterGoogle()"
          />

          <q-btn
            class="shadow-10 q-mb-md"
            color="red"
            data-test="btnClose"
            :label="t('close')"
            no-caps
            type="button"
            @click="appStore.showLoginDialog = false"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
