import React from "react";
import { FetchStateBuilder, FetchStatus } from "./statics";
import useMemoization from "./useMemoization";
import useSafeCallback from "./useSafeCallback";

function invokeIfPresent(fn, ...args) {
  if (typeof fn === "function") {
    return fn(...args);
  }
  return undefined;
}

export function useFetchOperation({
  // will be used to controle when to start the fetch
  // for example: condition=isHovered, condition=!!debouncedUsername
  condition = true,
  // defines whether this fetch action can be reloadable
  reloadable = true,
  // a callback fired (if present) when the fetch state changes
  onStateChange,

  /* depending on your project, this is the part that you may tune:
    - if working with redux, you can pass the actionCreator and its arguments
    - if working with axios directly, the promise and its arguments go here
    */
  // the url
  url,
  // the request function options
  options,

  retryable = false,
  retryDelay = 500,
  maxRetries = 3,

  indicator = true,
  // the component to be mounted if indicator is true
  // ts receives the fetch state and the reload function
  // can be used to tune if to display an inline loader or a dialog one
  IndicatorComponent,
  // contextual props to the indicator component
  IndicatorComponentProps
}) {
  const timeoutId = React.useRef();
  const retryMeter = React.useRef(0);
  const memoizedDeps = useMemoization({ url, options });
  const [fetchState, setFetchState] = React.useState(FetchStateBuilder.initial);

  const _onSuccess = React.useCallback(
    (requestData, data) => {
      retryMeter.current = 1;
      clearTimeout(timeoutId.current);

      const nextState = FetchStateBuilder.success({ data, requestData });
      setFetchState(nextState);
      invokeIfPresent(onStateChange, nextState);
    },
    [onStateChange]
  );

  console.log("mem", memoizedDeps.current);

  const successHandler = useSafeCallback({
    callback: _onSuccess,
    deps: [memoizedDeps.current] // if these change, the callback won't be invoked! that's the whole trick!
  });

  const _onError = React.useCallback(
    (requestData, error) => {
      if (retryable && retryMeter.current < maxRetries) {
        timeoutId.current = setTimeout(reload, retryDelay);
        return;
      }
      const nextState = FetchStateBuilder.error({ data: error, requestData });
      setFetchState(nextState);
      invokeIfPresent(onStateChange, nextState);
    },
    [retryable, setFetchState, onStateChange, maxRetries, retryDelay] // don't add reload as a dependency!
  );

  const errorHandler = useSafeCallback({
    callback: _onError,
    deps: [memoizedDeps.current, retryable, onStateChange]
  });

  const reload = React.useCallback(() => {
    if (!condition || !reloadable) {
      return;
    }
    retryMeter.current += 1;
    const requestData = { url, options };
    setFetchState(FetchStateBuilder.loading({ requestData }));
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => successHandler(requestData, data))
      .catch((error) => errorHandler(requestData, error));
  }, [condition, reloadable, url, options, successHandler, errorHandler]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  return {
    state: fetchState,
    reload,
    error: fetchState.status === FetchStatus.ERROR,
    loading: fetchState.status === FetchStatus.LOADING,
    success: fetchState.status === FetchStatus.SUCCESS,
    indicator: indicator && (
      <IndicatorComponent
        {...IndicatorComponentProps}
        reload={reload}
        state={fetchState}
        retryable={retryable}
      />
    )
  };
}
