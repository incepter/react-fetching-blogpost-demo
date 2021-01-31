export const FetchStatus = Object.freeze({
  INITIAL: "initial",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error"
});

export const FetchStateBuilder = {
  initial: { status: FetchStatus.INITIAL, content: null },
  success: (content) => ({ status: FetchStatus.SUCCESS, content }),
  error: (content) => ({ status: FetchStatus.ERROR, content }),
  loading: (content) => ({ status: FetchStatus.LOADING, content })
};

function checkStatus(response) {
  if (response.status < 200 || response.status > 399) {
    throw new Error(response.status);
  }
  return response;
}

// curry function used to determine how to parse a response
// (you may request data as blob! in this case there is no json())
function parseResponse(options) {
  return function parse(response) {
    return response.json();
  };
}

export function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseResponse(options))
    .catch((e) => {
      throw e;
    });
}
