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
