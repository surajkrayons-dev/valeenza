import { useEffect, useState } from "react";
import { getPolicyCategories } from "../services/policyApi";

export default function usePolicyCategories() {
  const [state, setState] = useState({ categories: [], loading: true, error: false });

  useEffect(() => {
    let active = true;
    getPolicyCategories().then(
      (categories) => {
        if (active) setState({ categories, loading: false, error: false });
      },
      () => {
        if (active) setState({ categories: [], loading: false, error: true });
      },
    );
    return () => { active = false; };
  }, []);

  return state;
}
