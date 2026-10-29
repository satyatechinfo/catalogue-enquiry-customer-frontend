import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs `task({ signal })` whenever `deps` change and exposes { data, error, loading, reload }.
 * Stale responses are ignored and in-flight requests are aborted on change/unmount.
 */
export function useAsync(task, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ data: s.data, error: null, loading: true }));
    taskRef
      .current({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.cancelled) return;
        setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
