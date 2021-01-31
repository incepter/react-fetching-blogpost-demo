import React from "react";
import { FetchStatus } from "./statics";

export default function InlineTextIndicator({ state, reload, retryable }) {
  const { status } = state;
  if (status === FetchStatus.SUCCESS || status === FetchStatus.INITIAL) {
    return null;
  }
  if (status === FetchStatus.LOADING) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      An error occured while fetch data.
      <br />
      Details: {state.content.data.toString()}
      <br />
      {retryable && <button onClick={reload}>Retry</button>}
    </div>
  );
}
