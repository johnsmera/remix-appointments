import type { IList } from "./IRequests.hook";
import { useCallback, useState } from "react";

export function makeList<TElement, TFilter = void>(
  service: IList<TElement, TFilter>
) {
  return function useList() {
    const [elements, setElements] = useState<TElement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    function onSuccess(elements: TElement[]) {
      setElements(elements);
      setLoading(false);
    }

    function onError(error: any) {
      setLoading(false);
      setError(error);
      throw new Error(error);
    }

    const list = useCallback((filter: TFilter) => {
      setLoading(true);
      setError(null);

      return service(filter)
        .then((response) => onSuccess(response))
        .catch((err) => onError(err));
    }, []);

    const reload = useCallback((filter: TFilter) => {
      setLoading(true);
      setError(null);

      return service(filter)
        .then((response) => onSuccess(response))
        .catch((err) => onError(err));
    }, []);

    return {
      elements,
      setElements,
      list,
      listLoading: loading,
      listError: error,
      reload,
    };
  };
}
