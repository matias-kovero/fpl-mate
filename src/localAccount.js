const keys = {
  id: 'user-id',
  page: 'last-page',
  recents: 'recent-search'
}

class LocalAccount {
  // It seems (commonjs) does not yet support private fields/classes, opting to underscore
  // #history;

  // Class constructor here...
  constructor() {
    // Should we here check if anything is saved?
    this.id = localStorage.getItem(keys.id)
    this._page = new PageManager(keys.page);
    this._history = new SearchHistory(keys.recents);
    this.recents = this._history.users;
  }
  // Getter
  get valid() {
    return this.loggedIn()
  }
  get activePage() {
    return this._page.active;
  }
  setPage(page) {
    if (page) { // sanity check
      this._page.update(page);
    }
  }
  // Methon
  loggedIn() {
    return !!this.id
  }
  // Method
  login({ id, name, team}) {
    this._history.add({ id, name, team });
    console.log('[Local Account] Login:', id, name);
    this.setDefault(id);
  }
  setDefault(id) {
    this.id = id;
    localStorage.setItem(keys.id, id);
  }
}

class LocalStorageObject {
  constructor(key, isArray=false) {
    this._key = key;
    this._isArr = isArray;
    this._data = this._getBase();
  }
  _getBase() {
    return this._isArr ? JSON.parse(localStorage.getItem(this._key) || "[]") : JSON.parse(localStorage.getItem(this._key));
  }
  _updateBase() {
    localStorage.setItem(this._key, JSON.stringify(this._data))
  }
}

class SearchHistory {
  /**
   * LocalStorage User Object
   * 
   * @typedef {Object} User
   * @property {string} id User ID
   * @property {string} name User name
   * @property {string} team User team name
   */

  constructor(key) {
    this._key = key;
    this._users = JSON.parse(localStorage.getItem(key) || "[]")
  }
  get users() {
    return this._users;
  }
  /**
   * Update persistent storage
   */
  update() {
    localStorage.setItem(this._key, JSON.stringify(this._users))
  }
  /**
   * @param {User} user - User getting added to persistent store.
   */
  add(user) {
    let idx = this._users.findIndex(u => u.id === user.id);
    if (idx !== -1) this._users.splice(idx, 1);
    this._users.unshift({ ...user });
    this.update()
  }
  /**
   * @param {User} user - User getting removed.
   */
  remove(user) {
    let idx = this._users.findIndex(u => u.id === user.id);
    if (idx > -1) this._users.splice(idx, 1);
    this.update();
  }
}

class PageManager extends LocalStorageObject {
  /**
   * As this is an SPA, opted to manage pages with this class
   * 
   * @typedef {Object} Page
   * @property {string} name page name
   */
  constructor(key) {
    super(key);
    if (!this.active) this.update('login');
  }
  get active() {
    return this._getBase();
  }
  update(page) {
    this._data = page;
    this._updateBase();
  }
}

export default LocalAccount