import { defineStore } from 'pinia';
import { type IUser } from './usersStore';

// Convert JSON document to TS Interface quickly: https://transform.tools/json-to-typescript

// Interface for Application common data:
export interface IState {
  showLoginDialog: boolean;
  showProfileDialog: boolean;
  showEditUserDialog: boolean;
  showCreateUserDialog: boolean;
  usersFilter: string;
  currentYear: number;
  selectedUser: Array<IUser>;
}

export const useAppStore = defineStore('appStore', {
  state: (): IState => ({
    usersFilter: '',
    showLoginDialog: false,
    showProfileDialog: false,
    showEditUserDialog: false,
    showCreateUserDialog: false,
    currentYear: new Date().getFullYear(),
    selectedUser: [] as Array<IUser>,
  }),
  // getters: {},
  actions: {},
  // all "state" data is stored in browser session store:
  persist: {
    storage: sessionStorage,
  },
});
