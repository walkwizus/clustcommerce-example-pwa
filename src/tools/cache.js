export default {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key, defaultValue = null) => {
    let value = localStorage.getItem(key)

    return value ? JSON.parse(value) : defaultValue;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
}