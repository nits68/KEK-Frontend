import { defineStore } from 'pinia';
import { type IUser } from './usersStore';
import { type ICategory } from './categoriesStore';
import { type IProduct } from './productsStore';

// Convert JSON document to TS Interface quickly: https://transform.tools/json-to-typescript

// Interface for Application common data:
export interface IState {
  usersFilter: string;
  productsFilter: string;
  showLoginDialog: boolean;
  showProfileDialog: boolean;
  showEditUserDialog: boolean;
  showCreateUserDialog: boolean;
  showEditCategoryDialog: boolean;
  showCreateCategoryDialog: boolean;
  showEditProductsDialog: boolean;
  showCreateProductsDialog: boolean;
  currentYear: number;
  selectedUser: Array<IUser>;
  selectedCategory: Array<ICategory>;
  selectedProduct: Array<IProduct>;
}

export const useAppStore = defineStore('appStore', {
  state: (): IState => ({
    usersFilter: '',
    productsFilter: '',
    showLoginDialog: false,
    showProfileDialog: false,
    showEditUserDialog: false,
    showCreateUserDialog: false,
    showEditCategoryDialog: false,
    showCreateCategoryDialog: false,
    showEditProductsDialog: false,
    showCreateProductsDialog: false,
    currentYear: new Date().getFullYear(),
    selectedUser: [] as Array<IUser>,
    selectedCategory: [] as Array<ICategory>,
    selectedProduct: [] as Array<IProduct>,
  }),

  // getters: {},
  actions: {},
  // all "state" data is stored in browser session store:
  persist: {
    storage: sessionStorage,
  },
});
