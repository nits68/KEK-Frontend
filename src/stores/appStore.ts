import { defineStore } from 'pinia';
import { type IUser } from './usersStore';
import { type ICategory } from './categoriesStore';

// Convert JSON document to TS Interface quickly: https://transform.tools/json-to-typescript

// Interface for Application common data:
export interface IState {
  showLoginDialog: boolean;
  showProfileDialog: boolean;
  showEditUserDialog: boolean;
  showCreateUserDialog: boolean;
  showEditCategoryDialog: boolean;
  showCreateCategoryDialog: boolean;
  usersFilter: string;
  currentYear: number;
  selectedUser: Array<IUser>;
  selectedCategory: Array<ICategory>;
}

export const useAppStore = defineStore('appStore', {
  state: (): IState => ({
    usersFilter: '',
    showLoginDialog: false,
    showProfileDialog: false,
    showEditUserDialog: false,
    showCreateUserDialog: false,
    showEditCategoryDialog: false,
    showCreateCategoryDialog: false,
    currentYear: new Date().getFullYear(),
    selectedUser: [] as Array<IUser>,
    selectedCategory: [] as Array<ICategory>,
  }),
  // getters: {},
  actions: {},
  // all "state" data is stored in browser session store:
  persist: {
    storage: sessionStorage,
  },
});
