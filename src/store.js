import { writable, get } from "svelte/store";
import * as api from './api';
import LocalUser, { PageManager } from './localUser';

const initialSession = {
  user: new LocalUser(),
  page: new PageManager(),
}

const session = writable(initialSession);

export function switchUser(user) {
  session.update((state) => {
    state.user.login(user);
    return state;
  });
}
export function switchPage(page) {
  session.update((state) => {
    state.page.update(page);
    return state;
  });
}

export default session;