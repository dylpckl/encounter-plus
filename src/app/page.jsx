"use client";
import { useState, useEffect } from "react";

import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/Monsters";
import ActiveMonsters from "@/components/ActiveMonsters";

import rollInitiative from "@/lib/rollInitiative";

const monsters = [
  { name: "Acolyte", dexterity: 17 },
  { name: "Aboleth", dexterity: 17 },
  { name: "Adult Black Dragon", dexterity: 17 },
  { name: "Adult Blue Dragon", dexterity: 17 },
  { name: "Adult Brass Dragon", dexterity: 17 },
  { name: "Adult Copper Dragon", dexterity: 17 },
  { name: "Adult Gold Dragon", dexterity: 17 },
  { name: "Adult Bronze Dragon", dexterity: 17 },
  { name: "Adult Green Dragon", dexterity: 17 },
  { name: "Adult Red Dragon", dexterity: 17 },
];

function filterMonsters(monsters, query) {
  query = query.toLowerCase();
  return monsters.filter((mon) =>
    mon.name.split(" ").some((word) => word.toLowerCase().startsWith(query))
  );
}

// async function getMonsters() {
//   const res = await fetch("http://localhost:3000/api/monsters", {
//     method: "POST",
//   });
//   if (!res.ok) {
//     throw new Error("failed to fetch monsters");
//   }
//   const monsters = await res.json();
//   return monsters.data.data.monsters;
// }

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeMonsters, setActiveMonsters] = useState([]);
  const results = filterMonsters(monsters, query);
  // const monsters = await getMonsters();
  // console.log(monsters);
  // const [monsters, setMonsters] = useState([]);

  function handleSearchChange(e) {
    setQuery(e.target.value);
  }

  // add to initiative
  function handleMonsterActive(monster) {
    // rollInitiative(monster.dexterity);

    setActiveMonsters([
      ...activeMonsters,
      { name: monster.name, active: true, init: rollInitiative(monster.dexterity) },
    ]);
  }

  function removeActiveMonster(monster) {}

  // useEffect(() => {
  //   const getMonsters = async () => {
  //     const response = await fetch("/api/monsters", { method: "POST" });

  //     const monsters = await response.json();
  //     // console.log(monsters);
  //     setMonsters(monsters.data.data.monsters);
  //   };

  //   getMonsters();
  // }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <SearchBar
          query={query}
          onChange={handleSearchChange}
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
      />
    </main>
  );
}
