import { isEqual } from "lodash";
import React from "react";

export default function useMemoization(value, areEqual = isEqual) {
  const memoizedValue = React.useRef();
  if (!areEqual(memoizedValue.current, value)) {
    memoizedValue.current = value;
  }
  return memoizedValue;
}
