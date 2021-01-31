import React from "react";
import InlineTextIndicator from "./fetchOperation/InlineTextIndicator";
import { useFetchOperation } from "./fetchOperation/useFetchOperation";
import "./styles.css";

function SearchUser() {
  const [userId, setUserId] = React.useState("");

  const { state, success, indicator } = useFetchOperation({
    condition: !!userId,
    IndicatorComponent: InlineTextIndicator,
    url: `https://jsonplaceholder.typicode.com/users/${userId}`,
    retryable: false,
    maxRetries: 5
  });

  return (
    <>
      <input
        onChange={(e) => setUserId(e.target.value)}
        placeholder="user id"
      />
      <br />
      {indicator}
      {success && <pre>{JSON.stringify(state, null, "  ")}</pre>}
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <SearchUser />
    </div>
  );
}

// export default function App() {
// const { state, success, indicator, reload } = useFetchOperation({
//   maxRetries: 5,
//   retryable: false,
//   IndicatorComponent: InlineTextIndicator,
//   url: "https://jsonplaceholder.typicode.com/todos/1"
// });

// return (
//   <div className="App">
//     <button onClick={reload}>reload</button>
//     <br />
//     {indicator}
//     {success && (
//       <div>
//         <pre>{JSON.stringify(state, null, "  ")}</pre>
//       </div>
//     )}
//   </div>
// );
// }
