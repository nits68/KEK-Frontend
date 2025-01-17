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

export interface ICategory {
  _id?: string;
  main_category?: string;
  category_name?: string;
}

interface IState {
  isLoading: boolean;
  categories: ICategory[];
  actCategory: ICategory;
  oldCategory: ICategory;
}

export const useCategoriesStore = defineStore('categoriesStore', {
  state: (): IState => ({
    isLoading: false,
    categories: [],
    actCategory: {} as ICategory,
    oldCategory: {} as ICategory,
  }),

  getters: {},

  actions: {
    async getAllCategories(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        this.categories = [];
        const res = await api.get('/categories');
        if (res?.data) {
          this.categories = res.data;
        }
      } catch (error: any) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async getCategoryById(): Promise<void> {
      try {
        Loading.show();
        if (this.actCategory?._id) {
          const res = await api.get(`/categories/${this.actCategory._id}`);
          if (res?.data) {
            this.actCategory = res.data;
            // store startig data to PATCH method and Reset button:
            Object.assign(this.oldCategory, this.actCategory);
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async editCategoryById(): Promise<void> {
      try {
        if (this.actCategory._id) {
          const diff: ICategory = {} as ICategory;
          Object.keys(this.actCategory).forEach((k, i) => {
            const newValue = Object.values(this.actCategory)[i];
            const oldValue = Object.values(this.oldCategory)[i];
            if (newValue != oldValue) diff[k] = newValue;
          });
          if (Object.keys(diff).length == 0) {
            Notify.create({
              message: 'Nothing changed!',
              color: 'negative',
            });
          } else {
            Loading.show();
            const res = await api.patch(`/categories/${this.actCategory._id}`, diff);
            const editedCategory: ICategory = res.data as ICategory;
            if (editedCategory?._id) {
              Notify.create({
                message: `Category with id=${editedCategory._id} has been edited successfully!`,
                color: 'positive',
              });
              appStore.selectedUser = [];
              appStore.selectedUser.push(res.data as ICategory);
            }
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async deleteCategoryById(): Promise<void> {
      try {
        if (this.actCategory._id) {
          Loading.show();
          await api.delete(`/categories/${this.actCategory._id}`);
          Notify.create({
            message: `Category with id=${this.actCategory._id} has been deleted successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async createCategory(): Promise<void> {
      try {
        Loading.show();
        const res = await api.post('/categories', this.actCategory);
        const newCategory: ICategory = res.data as ICategory;
        if (newCategory._id) {
          Notify.create({
            message: `New category with id=${newCategory._id} has been saved successfully!`,
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
