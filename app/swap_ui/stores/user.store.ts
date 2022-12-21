import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { StorageHelper } from "../utils";

export default class UserStore {
  private _isLogedIn = false;

  constructor(private readonly root_store: RootStore) {
    makeAutoObservable(this);
  }

  get isLogedIn() {
    return this._isLogedIn;
  }
}
