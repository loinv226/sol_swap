import { createContext, useContext } from "react";
import UiStore from "./ui.store";
import UserStore from "./user.store";

export class RootStore {
  uiStore: UiStore;
  userStore: UserStore;

  constructor() {
    this.uiStore = new UiStore();
    this.userStore = new UserStore(this);
  }
}

export const ROOT_STORE = new RootStore();
export const StoreContext = createContext(ROOT_STORE);
export const useStores = () => useContext(StoreContext);
