import { useCallback, useEffect, useState } from "react";

/** Re-read mock repositories after localStorage mutations. */
export function useMockRefresh<T>(loader: () => T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(loader);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    setData(loader());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps]);

  return { data, refresh };
}
