"use client";
import { useState, useEffect } from "react";

import SearchBar from "@/components/SearchBar";
import Monsters from "@/components/Monsters";

const monsters = [
  { name: "Acolyte" },
  { name: "Aboleth" },
  { name: "Adult Black Dragon" },
  { name: "Adult Blue Dragon" },
  { name: "Adult Brass Dragon" },
  { name: "Adult Copper Dragon" },
  { name: "Adult Gold Dragon" },
  { name: "Adult Bronze Dragon" },
  { name: "Adult Green Dragon" },
  { name: "Adult Red Dragon" },
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
  // const [first, setfirst] = useState(second);
  const results = filterMonsters(monsters, query);
  // const monsters = await getMonsters();
  // console.log(monsters);
  // const [monsters, setMonsters] = useState([]);

  function handleChange(e) {
    setQuery(e.target.value);
  }

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
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      {results && <Monsters monsters={results} />}
    </main>
  );
}
