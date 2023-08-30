"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import ActiveMonsters from "@/components/ActiveMonsters";
import rollInitiative from "@/lib/rollInitiative";
import MonsterCard from "./MonsterCard";

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
  // const results = filterMonsters(monsters, query);
  const [monsterResults, setMonsterResults] = useState([]);
  const [roundCounter, setRoundCounter] = useState(1);
  const sortedMonsters = activeMonsters.sort((a, b) => b.init - a.init);
  // const monsters = await getMonsters();
  // console.log(monsters);
  // const [monsters, setMonsters] = useState([]);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------
  function handleSearchChange(e) {
    setQuery(e.target.value);
    // console.log(query);

    const variables = { name: query };

    // hit API with query
    const fetchMonsters = async () => {
      const res = await fetch("/api/monsters", {
        method: "POST",
        body: JSON.stringify({ variables: variables }),
      });
      // if(res.status=)
      const data = await res.json();
      // console.log(data);
      // return res.json();
      setMonsterResults(data);
    };

    fetchMonsters();
  }

  function clearQuery() {
    // passed to SearchBar to enable clearing the input
    setQuery("");
  }

  function handleMonsterActive(monster) {
    // add to initiative
    setActiveMonsters([
      ...activeMonsters,
      {
        ...monster,
        maxHP: monster.hit_points,
        active: false,
        init: rollInitiative(monster.dexterity),
        id: nanoid(),
      },
    ]);
  }

  function handleKill(monster) {
    // console.log(monster);
    // set monster hp to zero
    const monsterIndexToKill = activeMonsters.findIndex(
      (m) => m.id === monster.id
    );
    // console.log(monsterIndexToKill);
    if (monsterIndexToKill !== -1) {
      // Create a new array with the updated monster object
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[monsterIndexToKill] = { ...monster, hit_points: 0 };

      // Update the state with the new array
      setActiveMonsters(updatedMonsters);
    }
  }

  function handleDelete(monster) {
    // remove monster from activeMonsters
  }

  function removeActiveMonster(monster) {}

  function startCombat() {
    const sortedMonsters = activeMonsters
      .slice()
      .sort((a, b) => b.init - a.init);
    console.log(sortedMonsters);
    // Mark the monster with the highest "init" value as active
    const updatedMonsters = sortedMonsters.map((monster, index) => ({
      ...monster,
      active: index === 0, // Set the first monster as active
    }));

    setActiveMonsters(updatedMonsters);
  }

  function nextTurn() {
    const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    if (activeIndex !== -1) {
      const updatedMonsters = [...activeMonsters]; // copy the activeMonster array so that we don't modify the original
      updatedMonsters[activeIndex].active = false; // mark the currently active monster as inactive

      const sortedMonsters = updatedMonsters
        .slice()
        .sort((a, b) => b.init - a.init);

      // find the index of the next monster that will be active.
      // If activeIndex is less than the length of sortedMonsters - 1, increment the index by 1.
      // Otherwise, if it's the last monster in the array, wrap around to the first monster (0 index)
      const nextActiveIndex =
        activeIndex < sortedMonsters.length - 1 ? activeIndex + 1 : 0;

      // Check if the next turn starts a new round
      if (nextActiveIndex === 0) {
        setRoundCounter(roundCounter + 1);
      }

      sortedMonsters[nextActiveIndex].active = true;

      setActiveMonsters(sortedMonsters);
    }
  }

  function previousTurn() {
    const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    if (activeIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[activeIndex].active = false;

      const sortedMonsters = updatedMonsters
        .slice()
        .sort((a, b) => b.init - a.init);
      const previousActiveIndex =
        activeIndex > 0 ? activeIndex - 1 : sortedMonsters.length - 1;

      sortedMonsters[previousActiveIndex].active = true;

      setActiveMonsters(sortedMonsters);
    }
  }

  function handleMonsterInitChange(monster, e) {
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    const updatedMonsters = [...activeMonsters];
    updatedMonsters[monsterIndex] = { ...monster, init: e.target.value };
    setActiveMonsters(updatedMonsters);
  }

  return (
    <div className="bg-slate-600 rounded-lg col-span-4 row-span-6 m-5 p-3 flex flex-col items-center relative">
      <div
        id="header"
        className="w-full bg-pink-600 "
      >
        <h1 className="text-sm uppercase">Initiative</h1>
        <div className="">
          <button onClick={() => setActiveMonsters([])}>clear</button>
          <span>round:</span>
          {roundCounter}
        </div>

        <div className="w-full">
          <SearchBar
            query={query}
            onChange={handleSearchChange}
            onClick={clearQuery}
          />
          {query.length > 0 && (
            <SearchResults
              monsters={monsterResults}
              onChange={handleMonsterActive}
            />
          )}
        </div>
      </div>
      <div className="overflow-y-auto h-full">
        {/* <ActiveMonsters
          monsters={activeMonsters}
          // onChange={handleMonsterActive}
        /> */}

        {/* const sortedMonsters = monsters.sort((a, b) => b.init - a.init); */}

        <ul className="w-full flex flex-col space-y-2">
          {sortedMonsters.map((monster) => (
            <li key={monster.id}>
              <MonsterCard
                monster={monster}
                onKill={handleKill}
                onInitChange={handleMonsterInitChange}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full justify-between mt-auto">
        <button onClick={startCombat}>start combat</button>
        <button onClick={nextTurn}>next turn</button>
        <button onClick={previousTurn}>previous turn</button>
      </div>
    </div>
  );
}
