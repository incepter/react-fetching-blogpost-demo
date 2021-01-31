import React from "react";
import useMemoization from "./useMemoization";

const EMPTY_ARRAY = Object.freeze([]);

export default function useSafeCallback({ callback, deps = EMPTY_ARRAY }) {
  const state = React.useRef({});
  const currentIndex = React.useRef(0);
  const lastMemoizedDeps = React.useRef();
  const memoizedDeps = useMemoization(deps);

  if (memoizedDeps.current !== lastMemoizedDeps.current) {
    currentIndex.current += 1;

    state.current[currentIndex.current] = {
      callback,
      cleaned: false,
      deps: memoizedDeps.current
    };

    lastMemoizedDeps.current = memoizedDeps.current;
  }

  const currentRenderIndex = currentIndex.current;

  React.useEffect(() => {
    const activeState = state.current[currentRenderIndex];

    return () => {
      activeState.cleaned = true;
    };
  }, [currentRenderIndex]);

  return React.useCallback(
    function safeCallback(...rest) {
      if (!currentRenderIndex) {
        return;
      }
      const currentWork = state.current[currentRenderIndex];
      if (currentWork && !currentWork.cleaned) {
        currentWork.callback(...rest);
      }
    },
    [currentRenderIndex]
  );
}
