export function round(value: number, num: number) {
  let factor = 10 ** num;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(
  value: number | string | undefined,
  option?: Intl.NumberFormatOptions | undefined
) {
  if (value == null) {
    return "0";
  }
  let _value = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(_value)) {
    _value = 0;
  }
  return _value.toLocaleString(undefined, {
    maximumFractionDigits: 8,
    // useGrouping: true,
    ...option,
  });
}

export function formatCurrency(
  value: number | string,
  option?: Intl.NumberFormatOptions | undefined
) {
  return (
    value.toLocaleString(undefined, {
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
      ...option,
    }) + "$"
  );
}
