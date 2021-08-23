
/**
 * Main store of the application.
 */
import { writable, get } from 'svelte/store';
import * as api from './api';
import Account from './localAccount'

const initialSession = {
  user: new Account(),
  page: null,
}

const session = writable(initialSession);

export function setUser(user) {
  session.update((state) => {
    state.user.login(user);
    state.user.setPage('Profile');
    return state;
  });
}
export function updatePage(page) {
  session.update((state) => {
    state.user.setPage(page);
    return state;
  });
}

export default session;