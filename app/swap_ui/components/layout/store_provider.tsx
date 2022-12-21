import { useEffect } from "react";
import { ROOT_STORE, StoreContext } from "../../stores";

export function StoreProvider({ children }: { children: JSX.Element }) {
  return (
    <StoreContext.Provider value={ROOT_STORE}>{children}</StoreContext.Provider>
  );
}
