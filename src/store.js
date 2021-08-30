import { writable, get } from "svelte/store";
import LocalUser, { PageManager } from './localUser';

const initialSession = {
  user: new LocalUser(),
  page: new PageManager(),
  //fantasy: new FantasyWrapper()
}

const session = writable(initialSession);

export function switchUser(user) {
  session.update((state) => {
    state.user.login(user);
    // Maybe this logic should not be here.
    state.page.update('Profile');
    return state;
  });
}
export function switchPage(page) {
  session.update((state) => {
    state.page.update(page);
    return state;
  });
}
export function switchSubPage(page) {
  session.update((state) => {
    state.page.updateSub(page);
    return state;
  });
}
export function logOut() {
  // Handling here just to trigger reactivity
  session.update((state) => {
    state.user.logout();
    return state;
  });
}

export const fantasy = writable({});
export default session;