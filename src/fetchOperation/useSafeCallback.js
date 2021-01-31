import React from "react";
import useMemoization from "./useMemoization";

const EMPTY_ARRAY = Object.freeze([]);

export default function useSafeCallback({ callback, deps = EMPTY_ARRAY }) {
  const index = React.useRef(0);
  const state = React.useRef({});
  const currentIndex = React.useRef();
  const memoizedDeps = useMemoization(deps);

  React.useEffect(() => {
    index.current += 1;
    const nextIndex = index.current;
    state.current[nextIndex] = {
      callback,
      cleaned: false,
      deps: memoizedDeps.current
    };
    currentIndex.current = nextIndex;

    const activeState = state.current[nextIndex];

    return () => {
      activeState.cleaned = true;
    };
  }, [callback, memoizedDeps.current]);

  return React.useCallback(function safeCallbacks(...rest) {
    if (!currentIndex.current) {
      return;
    }
    const currentWork = state.current[currentIndex.current];
    if (currentWork && !currentWork.cleaned) {
      currentWork.callback(...rest);
    }
  }, []);
}
