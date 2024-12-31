import { defineStore } from 'pinia';
import { type IUser } from './usersStore';
import { type ICategory } from './categoriesStore';
import { type IProduct } from './productsStore';
import { type IOffer } from './offersStore';

// Convert JSON document to TS Interface quickly: https://transform.tools/json-to-typescript

// Interface for Application common data:
export interface IState {
  usersFilter: string;
  productsFilter: string;
  offersFilter: string;
  showLoginDialog: boolean;
  showProfileDialog: boolean;
  showEditUserDialog: boolean;
  showCreateUserDialog: boolean;
  showEditCategoriesDialog: boolean;
  showCreateCategoryDialog: boolean;
  showEditProductsDialog: boolean;
  showCreateProductDialog: boolean;
  showEditOffersDialog: boolean;
  showCreateOfferDialog: boolean;
  currentYear: number;
  selectedUser: Array<IUser>;
  selectedCategory: Array<ICategory>;
  selectedProduct: Array<IProduct>;
  selectedOffer: Array<IOffer>;
}

export const useAppStore = defineStore('appStore', {
  state: (): IState => ({
    usersFilter: '',
    productsFilter: '',
    offersFilter: '',
    showLoginDialog: false,
    showProfileDialog: false,
    showEditUserDialog: false,
    showCreateUserDialog: false,
    showEditCategoriesDialog: false,
    showCreateCategoryDialog: false,
    showEditProductsDialog: false,
    showCreateProductDialog: false,
    showEditOffersDialog: false,
    showCreateOfferDialog: false,
    currentYear: new Date().getFullYear(),
    selectedUser: [] as Array<IUser>,
    selectedCategory: [] as Array<ICategory>,
    selectedProduct: [] as Array<IProduct>,
    selectedOffer: [] as Array<IOffer>,
  }),

  // getters: {},
  actions: {},
  // all "state" data is stored in browser session store:
  persist: {
    storage: sessionStorage,
  },
});
