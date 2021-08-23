// Stach these on some config file?
const keys = {
  id: 'user-id',
  page: 'last-page',
  recents: 'recent-search'
};

export default class LocalUser {

  constructor() {
    this.id = localStorage.getItem(keys.id);
    this.history = new SearchHistory();
  }
  get valid() {
    return this.loggedIn();
  }
  loggedIn() {
    return !!this.id;
  }
}

class LocalStorageObject {
  /**
   * It seems private fields aren't yet adopted on iOS, sad. 
   * Can't use #privatefields, opting for underscores.
   */
  //#key;
  constructor(key, isArray=false) {
    this._key = key;
    this._isArr = isArray;
    this._data = this._getBase();
  }
  /**
   * @private
   */
  _getBase() {
    return this._isArr ? JSON.parse(localStorage.getItem(this._key) || "[]") : JSON.parse(localStorage.getItem(this._key))
  }
  _updateBase() {
    localStorage.setItem(this._key, JSON.stringify(this._data));
  }
}

export class PageManager extends LocalStorageObject {
  /**
   * As this is an SPA, apted to manage pages with this class.
   */
  constructor() {
    super(keys.page);
    if (!this.active) this.update('Login');
  }
  get active() {
    return this._getBase();
  }
  update(page) {
    this._data = page;
    this._updateBase();
  }
}

class SearchHistory extends LocalStorageObject {
  /**
   * LocalStorage User Object
   * 
   * @typedef {Object} User
   * @property {string} id User ID
   * @property {string} name User name
   * @property {string} team User team name
   */
  constructor() {
    super(keys.recents, true);
  }
  /**
   * Get users search history.
   * @returns {User[]} Search history.
   */
  get users() {
    return this._data;
  }
  /**
   * Add search result to history.
   * @param {User} user - User added to store 
   */
  add(user) {
    let idx = this._data.findIndex(u => u.id === user.id);
    if (idx !== -1) this._data.splice(idx, 1);
    this._data.unshift({ ...user });
    this._updateBase();
  }
  /**
   * Remove user from history.
   * @param {User} user - User getting removed.
   */
  remove(user) {
    let idx = this._data.findIndex(u => u.id === user.id);
    if (idx > -1) this._data.splice(idx, 1);
    this._updateBase();
  }
}