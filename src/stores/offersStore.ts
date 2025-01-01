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

export interface IPagination {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  descending: boolean;
  rowsNumber: number;
}

export interface IOffer {
  _id?: string;
  offer_start?: Date;
  offer_end?: Date | null;
  unit?: string;
  unit_price?: number;
  quantity?: number;
  picture_url?: string;
  info?: string;
  user_id?: string;
  product_id?: string;
  expanded?: boolean;
}

interface IState {
  isLoading: boolean;
  offers: IOffer[];
  actOffer: IOffer;
  oldOffer: IOffer;
  pagination: IPagination;
}

export const useOfferssStore = defineStore('offersStore', {
  state: (): IState => ({
    isLoading: false,
    offers: [],
    actOffer: {} as IOffer,
    oldOffer: {} as IOffer,
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 12,
      rowsNumber: 0,
    },
  }),

  getters: {
    numberOfPage(): number {
      return Math.ceil(this.pagination.rowsNumber / this.pagination.rowsPerPage);
    },
  },

  actions: {
    async getAllOffers(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        this.offers = [];
        const res = await api.get('/offers');
        if (res?.data) {
          this.offers = res.data;
        }
      } catch (error: any) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async getMyOffers(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      try {
        this.offers = [];
        const res = await api.get('/offers/myoffer/get');
        if (res?.data) {
          this.offers = res.data;
        }
      } catch (error: any) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
        this.isLoading = false;
      }
    },

    async getOfferById(): Promise<void> {
      try {
        Loading.show();
        if (this.actOffer._id) {
          const res = await api.get(`/offers/${this.actOffer._id}`);
          if (res?.data) {
            this.actOffer = res.data;
            // store startig data to PATCH method and Reset button:
            Object.assign(this.oldOffer, this.actOffer);
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async editOfferById(): Promise<void> {
      try {
        if (this.actOffer._id) {
          const diff: IOffer = {} as IOffer;
          Object.keys(this.actOffer).forEach((k, i) => {
            const newValue = Object.values(this.actOffer)[i];
            const oldValue = Object.values(this.oldOffer)[i];
            if (newValue != oldValue) diff[k] = newValue;
          });
          if (Object.keys(diff).length == 0) {
            Notify.create({
              message: 'Nothing changed!',
              color: 'negative',
            });
          } else {
            Loading.show();
            const res = await api.patch(`/offers/${this.actOffer._id}`, diff);
            const editedOffer: IOffer = res.data as IOffer;
            if (editedOffer?._id) {
              Notify.create({
                message: `Offer with id=${editedOffer._id} has been edited successfully!`,
                color: 'positive',
              });
              appStore.selectedOffer = [];
              appStore.selectedOffer.push(res.data as IOffer);
            }
          }
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async deleteOfferById(): Promise<void> {
      try {
        if (this.actOffer._id) {
          Loading.show();
          await api.delete(`/offers/${this.actOffer._id}`);
          Notify.create({
            message: `Offer with id=${this.actOffer._id} has been deleted successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async deleteMyOfferById(): Promise<void> {
      try {
        if (this.actOffer._id) {
          Loading.show();
          await api.delete(`/offers/myoffer/${this.actOffer._id}`);
          Notify.create({
            message: `Your offer with id=${this.actOffer._id} has been deleted successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async createOffer(): Promise<void> {
      try {
        Loading.show();
        const res = await api.post('/offers', this.actOffer);
        const newOffer: IOffer = res.data as IOffer;
        if (newOffer._id) {
          Notify.create({
            message: `New offer with id=${newOffer._id} has been saved successfully!`,
            color: 'positive',
          });
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async getPaginatedOffers(): Promise<void> {
      try {
        Loading.show();
        const filter: string = appStore.offersFilter == '' ? '*' : appStore.offersFilter;
        const res = await api.get(
          `/offers/${(this.pagination.page - 1) * this.pagination.rowsPerPage}/${this.pagination.rowsPerPage}/${this.pagination.sortBy}/${filter}`,
        );
        if (res?.data) {
          this.offers = res.data;
          this.pagination.rowsNumber = parseInt(res.headers['x-total-count']);
        }
      } catch (error) {
        ShowErrorWithNotify(error);
      } finally {
        Loading.hide();
      }
    },

    async getPaginatedActiveOffers(): Promise<void> {
      try {
        Loading.show();
        const filter: string = appStore.actOffersFilter == '' ? '*' : appStore.actOffersFilter;
        const res = await api.get(
          `/offers/active/${(this.pagination.page - 1) * this.pagination.rowsPerPage}/${this.pagination.rowsPerPage}/${this.pagination.sortBy}/${filter}`,
        );
        if (res?.data) {
          this.pagination.rowsNumber = parseInt(res.headers['x-total-count']);
          this.offers = res.data.map((e: any) => ({ ...e, expanded: false, order_quantity: 0 }));
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
