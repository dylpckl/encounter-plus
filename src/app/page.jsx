// "use client";
// import { useState, useEffect } from "react";
// import { nanoid } from "nanoid";

// import rollInitiative from "@/lib/rollInitiative";

import InitTracker from "@/components/InitTracker";

// const monsters = [
//   {
//     name: "Acolyte",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Aboleth",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Black Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Blue Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Brass Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Copper Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Gold Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Bronze Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Green Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
//   {
//     name: "Adult Red Dragon",
//     dexterity: 17,
//     armor_class: [
//       {
//         value: 13,
//       },
//     ],
//     hit_points: 102,
//   },
// ];

// function filterMonsters(monsters, query) {
//   query = query.toLowerCase();
//   return monsters.filter((mon) =>
//     mon.name.split(" ").some((word) => word.toLowerCase().startsWith(query))
//   );
// }

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
  // const [query, setQuery] = useState("");
  // const [activeMonsters, setActiveMonsters] = useState([]);
  // const results = filterMonsters(monsters, query);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props

  return (
    <>
      <InitTracker />
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
