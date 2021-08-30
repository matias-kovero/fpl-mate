// Stach these on some config file?
import { getUserData, getUserPicks } from './fantasy';
const keys = {
  id: 'user-id',
  page: 'last-page',
  recents: 'recent-search'
};

export default class LocalUser {

  constructor() {
    this.id = localStorage.getItem(keys.id);
    this.history = new SearchHistory();
    this.user = null;
    if (this.id) {
      this.user = getUserData(this.id);
    }
  }
  get valid() {
    return this.loggedIn();
  }
  loggedIn() {
    return !!this.id;
  }
  get data() {
    return this.user;
  }
  /**
   * current default/favourite user
   */
  get favourite() {
    return localStorage.getItem(keys.id);
  }
  /**
   * User to login.
   * @param {User} user 
   */
  login(user) {
    // sanity
    if (!user.id || !user.name || !user.team) return;
    this.history.add(user);
    this.id = user.id;
    this.user = getUserData(this.id);
  }
  logout() {
    // current user = this.id
    this.id = null;
    console.log('Logged out!');
  }
  picks(gameweek) {
    //let p = getUserPicks(this.id, gameweek);
    // Return calculated picks ??
    return getUserPicks(this.id, gameweek);
  }
  /**
   * Set an user id to default user id.
   * @param {string} id 
   */
  setFavourite(id) {
    localStorage.setItem(keys.id, id);
  }
  /**
   * Remove user from our search history.
   * @param {string} id 
   */
  delete(id) {
    console.log('Removing user id', id);
    this.history.remove(id);
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
    this.sub_page = null;
    if (!this.active) this.update('Landing'); // Maybe Landing?
  }
  get active() {
    return this._getBase();
  }
  get sub() {
    return this.sub_page;
  }
  update(page) {
    this._data = page;
    this.sub_page = null; // Reset sub page, this is too fast - getting artifacts
    this._updateBase();
  }
  updateSub(page) {
    this.sub_page = page;
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
  users() {
    return this._getBase();
  }
  /**
   * Add search result to history.
   * @param {User} user - User added to store 
   */
  add(user) {
    let idx = this._data.findIndex(u => u.id == user.id); // Ik, but handing numbers & strings
    if (idx !== -1) this._data.splice(idx, 1);
    this._data.unshift({ ...user });
    this._updateBase();
  }
  /**
   * Remove user from history.
   * @param {number} id - User id getting removed.
   */
  remove(id) {
    console.log('Trying to remove');
    let idx = this._data.findIndex(u => u.id === id); // Ik, but handing numbers & strings
    console.log('Array id:', idx);
    if (idx > -1) this._data.splice(idx, 1);
    console.log(this._data);
    this._updateBase();
  }
}