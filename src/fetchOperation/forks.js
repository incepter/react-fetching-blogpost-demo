import { useFetchOperation } from "./useFetchOperation";

export function useGhostFetchOperation(args) {
  return useFetchOperation({ ...args, indicator: false });
}

// how this is different from useGhostFetchOperation?
// it is powerful because it swallows the fetchOperation re-renders ;)
export function FetchTrigger(args) {
  useGhostFetchOperation(args);
  return null;
}

export function useGlobalFetchOperation(args) {
  return useFetchOperation({ ...args, IndicatorComponent: ModalLoader });
}
function ModalLoader() {
  return "This is supposed to be a modal with a spinner";
}
