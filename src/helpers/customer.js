import cache from "../tools/cache";

export default {
  getCurrentCustomer: () => {
    return cache.get('CLUST_CUSTOMER');
  },
  login: (username, password) => {
    // @todo
  }
}