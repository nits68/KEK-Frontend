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
  actOffersFilter: string;
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
  showEditMyOffersDialog: boolean;
  showCreateMyOfferDialog: boolean;
  currentYear: number;
  basketCounter: number;
  selectedUser: Array<IUser>;
  selectedCategory: Array<ICategory>;
  selectedProduct: Array<IProduct>;
  selectedOffer: Array<IOffer>;
  selectedMyOffer: Array<IOffer>;
}

export const useAppStore = defineStore('appStore', {
  state: (): IState => ({
    usersFilter: '',
    productsFilter: '',
    offersFilter: '',
    actOffersFilter: '',
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
    showEditMyOffersDialog: false,
    showCreateMyOfferDialog: false,
    currentYear: new Date().getFullYear(),
    basketCounter: 0,
    selectedUser: [] as Array<IUser>,
    selectedCategory: [] as Array<ICategory>,
    selectedProduct: [] as Array<IProduct>,
    selectedOffer: [] as Array<IOffer>,
    selectedMyOffer: [] as Array<IOffer>,
  }),

  // getters: {},
  actions: {
    resetAppStore(): void {
      this.usersFilter = '';
      this.productsFilter = '';
      this.offersFilter = '';
      this.actOffersFilter = '';
      this.showLoginDialog = false;
      this.showProfileDialog = false;
      this.showEditUserDialog = false;
      this.showCreateUserDialog = false;
      this.showEditCategoriesDialog = false;
      this.showCreateCategoryDialog = false;
      this.showEditProductsDialog = false;
      this.showCreateProductDialog = false;
      this.showEditOffersDialog = false;
      this.showCreateOfferDialog = false;
      this.showEditMyOffersDialog = false;
      this.showCreateMyOfferDialog = false;
      this.basketCounter = 0;
      this.selectedUser = [];
      this.selectedCategory = [];
      this.selectedProduct = [];
      this.selectedOffer = [];
      this.selectedMyOffer = [];
    },
  },
  // all "state" data is stored in browser session store:
  persist: {
    storage: sessionStorage,
  },
});
