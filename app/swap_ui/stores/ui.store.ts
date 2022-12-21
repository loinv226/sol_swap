import { makeAutoObservable } from "mobx";

export default class UiStore {
  private _isShowLogin = false;

  constructor() {
    makeAutoObservable(this);
  }
  get isShowLogin() {
    return this._isShowLogin;
  }
  showLogin() {
    this._isShowLogin = true;
  }
}
