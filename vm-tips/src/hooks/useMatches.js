// Hook för att hämta alla matcher från Supabase.
// Returnerar matches, loading-state och eventuella errors till Speltipset.

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [matchesError, setMatchesError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true);

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id");

      if (error) {
        console.error(error);
        setMatchesError(error);
        setLoadingMatches(false);
        return;
      }

      setMatches(data);
      setLoadingMatches(false);
    };

    fetchMatches();
  }, []);

  return {
    matches,
    loadingMatches,
    matchesError,
  };
}
