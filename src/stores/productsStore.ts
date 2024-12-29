import { defineStore } from 'pinia';
import { Notify, Loading } from 'quasar';
import { api } from '../boot/axios';
import { useAppStore } from './appStore';
import { type ICategory } from './categoriesStore';

const appStore = useAppStore();

Notify.setDefaults({
  position: 'bottom',
  textColor: 'white',
  timeout: 3000,
  actions: [{ icon: 'close', color: 'white' }],
});

export interface IProduct {
  _id?: string;
  product_name?: string;
  picture_url?: string;
  category_id?: string;
  category?: ICategory;
}

interface IState {
  isLoading: boolean;
  products: IProduct[];
  actProduct: IProduct;
  oldProduct: IProduct;
}

export const useProductsStore = defineStore('productsStore', {
  state: (): IState => ({
    isLoading: false,
    products: [],
    actProduct: {} as IProduct,
    oldProduct: {} as IProduct,
  }),

  getters: {},

  actions: {
    async getAllProducts(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        this.products = [];
        const res = await api.get('/products');
        if (res?.data) {
          this.products = res.data;
        }
      } catch (error: any) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async getProductById(): Promise<void> {
      try {
        Loading.show();
        if (this.actProduct._id) {
          const res = await api.get(`/products/${this.actProduct._id}`);
          if (res?.data) {
            this.actProduct = res.data;
            // store startig data to PATCH method and Reset button:
            Object.assign(this.oldProduct, this.actProduct);
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async getProductsByFilter(): Promise<void> {
      try {
        if (appStore.productsFilter) {
          this.products = [];
          Loading.show();
          const res = await api.get(`/products/keyword/${appStore.productsFilter}`);
          if (res?.data) {
            this.products = res.data;
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async editProductById(): Promise<void> {
      try {
        if (this.actProduct._id) {
          const diff: IProduct = {} as IProduct;
          Object.keys(this.actProduct).forEach((k, i) => {
            const newValue = Object.values(this.actProduct)[i];
            const oldValue = Object.values(this.oldProduct)[i];
            if (newValue != oldValue) diff[k] = newValue;
          });
          if (Object.keys(diff).length == 0) {
            Notify.create({
              message: 'Nothing changed!',
              color: 'negative',
            });
          } else {
            Loading.show();
            const res = await api.patch(`/products/${this.actProduct._id}`, diff);
            const editedProduct: IProduct = res.data as IProduct;
            if (editedProduct?._id) {
              Notify.create({
                message: `Product with id=${editedProduct._id} has been edited successfully!`,
                color: 'positive',
              });
              appStore.selectedProduct = [];
              appStore.selectedProduct.push(res.data as IProduct);
            }
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async deleteProductById(): Promise<void> {
      try {
        if (this.actProduct._id) {
          Loading.show();
          await api.delete(`/products/${this.actProduct._id}`);
          Notify.create({
            message: `Product with id=${this.actProduct._id} has been deleted successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async createProduct(): Promise<void> {
      try {
        Loading.show();
        const res = await api.post('/products', this.actProduct);
        const newProduct: IProduct = res.data as IProduct;
        if (newProduct._id) {
          Notify.create({
            message: `New product with id=${newProduct._id} has been saved successfully!`,
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
