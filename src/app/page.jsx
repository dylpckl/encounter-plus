// "use client";
// import { useState, useEffect } from "react";
// import { nanoid } from "nanoid";

// import rollInitiative from "@/lib/rollInitiative";

import InitTracker from "@/components/InitTracker";
import Encounters from "@/components/Encounters"


export default function Home() {
  // const [query, setQuery] = useState("");
  // const [activeMonsters, setActiveMonsters] = useState([]);
  // const results = filterMonsters(monsters, query);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props

  return (
    <>
      <InitTracker />
      <Encounters />
      {/* <div>
        <SearchBar
          query={query}
          onChange={handleSearchChange}
          onClick={clearQuery}
        />
        {query.length > 0 && (
          <SearchResults
            monsters={results}
            onChange={handleMonsterActive}
          />
        )}
      </div>

      <ActiveMonsters
        monsters={activeMonsters}
        // onChange={handleMonsterActive}
      /> */}
    </>
  );
}
