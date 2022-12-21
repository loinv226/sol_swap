import { ChangeEventHandler, useState } from "react";

export function useInput<T>(init: T | undefined) {
  const [value, setValue] = useState<T | undefined>(init);

  const onChange = function (_value: any) {
    if (typeof _value === "object") {
      if (_value.target?.value != null) {
        setValue(_value.target.value);
        return _value.target.value;
      } else {
        setValue(_value);
      }
    } else {
      setValue(_value);
    }
  };
  
  function clear() {
    setValue(undefined);
  }

  const onChangeChecked = function (_value: any) {
    if (typeof _value === "object") {
      if (_value.target?.checked != null) {
        setValue(_value.target.checked);
      } else {
        setValue(_value);
      }
    } else {
      setValue(_value);
    }
  };
  return {
    value,
    onChange,
    onChangeChecked,
    clear,
  };
}
