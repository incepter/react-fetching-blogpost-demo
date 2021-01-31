import React from "react";
import InlineTextIndicator from "./fetchOperation/InlineTextIndicator";
import { useFetchOperation } from "./fetchOperation/useFetchOperation";
import "./styles.css";

function SearchDemo() {
  const [userId, setUserId] = React.useState("");

  const { state, success, indicator, reload } = useFetchOperation({
    condition: !!userId,
    IndicatorComponent: InlineTextIndicator,
    url: `https://jsonplaceholder.typicode.com/users/${userId}`
  });

  return (
    <div>
      <button onClick={reload}>reload</button>
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

export default function App() {
  return (
    <div className="App">
      <SearchDemo />
    </div>
  );
}
