import React from "react";
import InlineTextIndicator from "./fetchOperation/InlineTextIndicator";
import { useFetchOperation } from "./fetchOperation/useFetchOperation";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <SearchDemo />
    </div>
  );
}

function SearchDemo() {
  const [userId, setUserId] = React.useState("");

  const { state, success, indicator, reload } = useFetchOperation({
    retryable: true,
    reloadable: true,
    condition: !!userId,
    IndicatorComponent: InlineTextIndicator,
    url: `https://jsonplaceholder.typicode.com/users/${userId}`
  });

  return (
    <div>
      <button onClick={reload}>Reload</button>
      <input
        onChange={(e) => setUserId(e.target.value)}
        placeholder="user id"
      />
      <br />
      {indicator}
      {success && <pre>{JSON.stringify(state, null, "  ")}</pre>}
    </div>
  );
}
