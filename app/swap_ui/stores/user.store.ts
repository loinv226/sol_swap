import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export default class UserStore {
  private _isLogedIn = false;

  constructor(private readonly root_store: RootStore) {
    makeAutoObservable(this);
  }

  get isLogedIn() {
    return this._isLogedIn;
  }
}
