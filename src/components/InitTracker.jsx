"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/Monsters";
import ActiveMonsters from "@/components/ActiveMonsters";
import rollInitiative from "@/lib/rollInitiative";

const monsters = [
  {
    name: "Acolyte",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Aboleth",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Black Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Blue Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Brass Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Copper Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Gold Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Bronze Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Green Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
  {
    name: "Adult Red Dragon",
    dexterity: 17,
    armor_class: [
      {
        value: 13,
      },
    ],
    hit_points: 102,
  },
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

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------
  function handleSearchChange(e) {
    setQuery(e.target.value);
    console.log(query);

    const variables = { name: query };

    // hit API with query
    const fetchMonsters = async () => {
      const res = await fetch("/api/monsters", {
        method: "POST",
        body: JSON.stringify({ variables: variables }),
      });
      // if(res.status=)
      const data = await res.json();
      console.log(data);
      // return res.json();
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
        // active: true,
        init: rollInitiative(monster.dexterity),
        id: nanoid(),
      },
    ]);
  }

  function removeActiveMonster(monster) {}

  function startCombat() {
    activeMonsters.map((monster) => {
      setActiveMonsters([...activeMonsters, { ...monster, active: true }]);
    });
  }

  function handleNextTurn() {
    // find currently active monster, set active to false
    // set next monster active = true
    // increment round counter
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
    <div className="bg-slate-600 overflow-y-auto rounded-lg col-span-4 row-span-6 m-3 p-3 flex flex-col items-center relative">
      <div
        id="header"
        className="w-full bg-pink-600"
      >
        <h1 className="text-sm uppercase">Initiative</h1>
        <div className="">
          <button onClick={() => setActiveMonsters([])}>clear</button>
          <span>round:</span>
        </div>
      </div>

      <div className="w-full">
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
      />
      <div className="flex w-full justify-between">
        <button>start combat</button>
        <button>next turn</button>
      </div>
    </div>
  );
}
