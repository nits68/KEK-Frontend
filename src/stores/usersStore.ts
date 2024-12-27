import { defineStore } from 'pinia';
import { Notify, Loading } from 'quasar';
import { api } from '../boot/axios';
import { useAppStore } from './appStore';

const appStore = useAppStore();

Notify.setDefaults({
  position: 'bottom',
  textColor: 'white',
  timeout: 3000,
  actions: [{ icon: 'close', color: 'white' }],
});

export interface IUser {
  _id?: string;
  email?: string;
  email_verified?: boolean;
  auto_login?: boolean;
  name?: string;
  password?: string;
  roles?: string[];
  mobile_number?: string;
  picture?: string;
}

interface IState {
  loggedUser: null | IUser;
  isLoading: boolean;
  users: IUser[];
  actUser: IUser;
  oldUser: IUser;
}

export const useUsersStore = defineStore('usersStore', {
  state: (): IState => ({
    loggedUser: null,
    isLoading: false,
    users: [],
    actUser: {} as IUser,
    oldUser: {} as IUser,
  }),

  getters: {
    getLoggedUser(): null | IUser {
      return this.loggedUser;
    },
    isAdmin(): boolean {
      return this.loggedUser?.roles?.includes('admin') || false;
    },
    isUser(): boolean {
      return this.loggedUser?.roles?.includes('user') || false;
    },
    isSp(): boolean {
      return this.loggedUser?.roles?.includes('sp') || false;
    },
  },

  actions: {
    async loginRegisterWithGoogle(accessToken: string) {
      Loading.show();
      this.isLoading = true;
      api
        .post('auth/google', { atoken: accessToken })
        .then((res) => {
          this.loggedUser = res.data as IUser;
          Notify.create({
            message: `${this.loggedUser.name} with ${this.loggedUser.email} e-mail is logged in`,
            color: 'positive',
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: 'Error on Authentication', color: 'negative' });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async loginUser(params: IUser): Promise<void> {
      Loading.show();
      this.isLoading = true;
      api
        .post('auth/login', {
          email: params.email,
          password: params.password,
        })
        .then((res) => {
          this.loggedUser = res.data;
          Notify.create({
            message: `${res.data.name} with ${res.data.email} e-mail is logged in`,
            color: 'positive',
          });
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: 'Error on Authentication', color: 'negative' });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async registerUser(params: IUser): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        await api.post('auth/register', {
          email: params.email,
          password: params.password,
        });
        Notify.create({
          message: 'Check your email (SPAM folder too) to verify your account',
          color: 'positive',
        });
      } catch (error: any) {
        this.loggedUser = null;
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async autoLogin(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      api
        .post('auth/autologin')
        .then((res) => {
          if (res.status == 404) {
            this.loggedUser = null;
          } else {
            this.loggedUser = res.data;
            Notify.create({
              message: `Auto login success with ${this.loggedUser?.email}}`,
              color: 'positive',
            });
          }
        })
        .catch((error) => {
          this.loggedUser = null;
          Notify.create({
            message: `Auto login not aviable! ${error.response.data.message}`,
            color: 'negative',
          });
        })
        .finally(() => {
          Loading.hide();
          this.isLoading = false;
        });
    },

    async logOut(withNotify = true): Promise<void> {
      Loading.show();
      this.isLoading = true;
      api
        .post('auth/logout')
        .then(() => {
          this.loggedUser = null;
          if (withNotify) {
            Notify.create({
              message: 'Successful logout',
              color: 'positive',
            });
          }
        })
        .catch(() => {
          this.loggedUser = null;
          Notify.create({ message: 'Error on log out', color: 'negative' });
        })
        .finally(() => {
          this.isLoading = false;
          Loading.hide();
        });
    },

    async closeApp(): Promise<void> {
      api.post('auth/closeapp').then(() => {
        this.loggedUser = null;
      });
    },

    async getAllUsers(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        this.users = [];
        const res = await api.get('/users');
        if (res?.data) {
          this.users = res.data;
        }
      } catch (error: any) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async getUserById(): Promise<void> {
      try {
        Loading.show();
        if (this.actUser?._id) {
          const res = await api.get(`/users/${this.actUser._id}`);
          if (res?.data) {
            this.actUser = res.data;
            // store startig data to PATCH method and Reset button:
            Object.assign(this.oldUser, this.actUser);
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async getUsersByFilter(): Promise<void> {
      try {
        if (appStore.usersFilter) {
          this.users = [];
          Loading.show();
          const res = await api.get(`/users/keyword/${appStore.usersFilter}`);
          if (res?.data) {
            this.users = res.data;
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async editUserById(): Promise<void> {
      try {
        if (this.actUser._id) {
          const diff: IUser = {} as IUser;
          Object.keys(this.actUser).forEach((k, i) => {
            const newValue = Object.values(this.actUser)[i];
            const oldValue = Object.values(this.oldUser)[i];
            if (newValue != oldValue) diff[k] = newValue;
          });
          if (Object.keys(diff).length == 0) {
            Notify.create({
              message: 'Nothing changed!',
              color: 'negative',
            });
          } else {
            Loading.show();
            const res = await api.patch(`/users/${this.actUser._id}`, diff);
            const editedUser: IUser = res.data as IUser;
            if (editedUser?._id) {
              Notify.create({
                message: `User with id=${editedUser._id} has been edited successfully!`,
                color: 'positive',
              });
              appStore.selectedUser = [];
              appStore.selectedUser.push(res.data as IUser);
            }
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async editProfileById(): Promise<void> {
      try {
        if (this.actUser._id) {
          const diff: IUser = {} as IUser;
          Object.keys(this.actUser).forEach((k, i) => {
            const newValue = Object.values(this.actUser)[i];
            const oldValue = Object.values(this.oldUser)[i];
            if (newValue != oldValue) diff[k] = newValue;
          });
          if (Object.keys(diff).length == 0) {
            Notify.create({
              message: 'Nothing changed!',
              color: 'negative',
            });
          } else {
            Loading.show();
            const res = await api.patch(`/users/profile/${this.actUser._id}`, diff);
            const editedUser: IUser = res.data as IUser;
            if (editedUser?._id) {
              Notify.create({
                message: `User with id=${editedUser._id} profile has been edited successfully!`,
                color: 'positive',
              });
              appStore.selectedUser = [];
              appStore.selectedUser.push(res.data as IUser);
            }
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async deleteUserById(): Promise<void> {
      try {
        if (this.actUser._id) {
          if (this.actUser._id == this.loggedUser?._id) {
            Notify.create({
              message: 'You can not delete yourself!',
              color: 'negative',
            });
            return;
          }
          Loading.show();
          await api.delete(`/users/${this.actUser._id}`);
          Notify.create({
            message: `User with id=${this.actUser._id} has been deleted successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async crateUser(): Promise<void> {
      try {
        Loading.show();
        const res = await api.post('/users', this.actUser);
        const newUser: IUser = res.data as IUser;
        if (newUser._id) {
          Notify.create({
            message: `New user with id=${newUser._id} has been saved successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },
  },

  // all "state" data is stored in browser session store
  persist: {
    storage: sessionStorage,
  },
});

function ShowErrorWithNotify(error: any): void {
  Loading.hide();
  let msg = 'Hiba!';

  // The JavaScript optional chaining (?.) operator accesses an object's property or calls a function.
  // If the object accessed or function called is undefined or null,
  // it returns undefined instead of throwing an error.
  if (error?.response?.data?.status) {
    msg += ` (${error.response.data.status}):`;
  } else if (error?.response?.status) {
    msg += ` (${error.response.status}):`;
  } else {
    msg += ':';
  }

  if (error?.response?.data?.message) {
    msg += ` ${error.response.data.message}`;
  } else if (error?.response?.message) {
    msg += ` ${error.response.message}`;
  } else if (error?.request && error?.message) {
    msg += ` No response(${error.message})`; // if no response
  } else if (error?.message) {
    msg += ` Message(${error.message})`;
  } else {
    msg += ' Unknow error message';
  }
  Notify.create({ message: msg, color: 'negative' });
}
