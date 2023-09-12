"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import rollInitiative from "@/lib/rollInitiative";
import MonsterCard from "./MonsterCard";
import useDebounce from "@/lib/hooks/useDebounce";

function filterMonsters(monsters, query) {
  query = query.toLowerCase();
  return monsters.filter((mon) =>
    mon.name.split(" ").some((word) => word.toLowerCase().startsWith(query))
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeMonsters, setActiveMonsters] = useState([]);
  // const results = filterMonsters(monsters, query);
  const [monsterResults, setMonsterResults] = useState([]);
  const [roundCounter, setRoundCounter] = useState(1);
  const sortedMonsters = activeMonsters.sort((a, b) => b.init - a.init);
  const debouncedSearch = useDebounce(query);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------

  useEffect(() => {
    const variables = { name: debouncedSearch };

    const fetchMonsters = async () => {
      const res = await fetch("/api/monsters", {
        method: "POST",
        body: JSON.stringify({ variables: variables }),
      });
      const data = await res.json();
      // console.log(data);
      // return res.json();
      setMonsterResults(data);
    };

    fetchMonsters();
  }, [debouncedSearch]);

  function handleSearchChange(e) {
    setQuery(e.target.value);

    const variables = { name: debouncedSearch };

    const fetchMonsters = async () => {
      const res = await fetch("/api/monsters", {
        method: "POST",
        body: JSON.stringify({ variables: variables }),
      });
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

  function handleAddActiveMonster(monster) {
    // add monster to initiative
    // 1. check if any activeMonsters already have the same name
    // if no monster with the matching name already has "1" at the end, update the first occurrence to be "[name] 1"
    // otherwise, update the first occurrence to be "[name] 1"
    //

    const existingMonsterIndex = activeMonsters.findIndex(
      (activeMonster) => activeMonster.name === monster.name
    );

    // if (existingMonsterIndex !== -1) {
    //   const updatedMonsters = [...activeMonsters];

    //   if (updatedMonsters[existingMonsterIndex].name.endsWith('1')){

    //   }
    // }

    if (existingMonsterIndex !== -1) {
      // An existing monster with the same name was found
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[existingMonsterIndex].name = getUniqueMonsterName(
        monster.name
      );

      setActiveMonsters([
        ...updatedMonsters,
        {
          ...monster,
          maxHP: monster.hit_points,
          active: false,
          init: rollInitiative(monster.dexterity),
          id: nanoid(),
          conditions: {
            BLND: false,
            CHRM: false,
            DEAF: false,
            FRGHT: false,
            GRPL: false,
            INCAP: false,
            INVIS: false,
            PRLZ: false,
            PETR: false,
            POIS: false,
            PRNE: false,
            REST: false,
            STUN: false,
            UNCON: false,
          },
        },
      ]);
    } else {
      // No existing monster with the same name was found
      setActiveMonsters([
        ...activeMonsters,
        {
          ...monster,
          maxHP: monster.hit_points,
          active: false,
          init: rollInitiative(monster.dexterity),
          id: nanoid(),
          conditions: {
            BLND: false,
            CHRM: false,
            DEAF: false,
            FRGHT: false,
            GRPL: false,
            INCAP: false,
            INVIS: false,
            PRLZ: false,
            PETR: false,
            POIS: false,
            PRNE: false,
            REST: false,
            STUN: false,
            UNCON: false,
          },
        },
      ]);
    }
  }

  function getUniqueMonsterName(baseName) {
    let newName = baseName;
    let count = 1;

    while (
      activeMonsters.some((activeMonster) => activeMonster.name === newName)
    ) {
      newName = `${baseName} ${count}`;
      count++;
    }

    return newName;
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

  function handleDeleteMonster(monster) {
    // remove monster from activeMonsters
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    if (monsterIndex !== -1) {
      const updatedMonsters = activeMonsters.filter(
        (_, index) => index !== monsterIndex
      );
      setActiveMonsters(updatedMonsters);
    }
  }

  function handleMonsterCondition(monster, condition) {
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    if (monsterIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      const currentConditionValue = monster.conditions[condition];
      updatedMonsters[monsterIndex] = {
        ...monster,
        conditions: {
          ...monster.conditions,
          [condition]: !currentConditionValue,
        },
      };

      // Update the state with the new array
      setActiveMonsters(updatedMonsters);
    }
  }

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

  function handleMonsterUpdate(monster, keyToUpdate, newValue) {
    const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    if (monsterIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[monsterIndex] = { ...monster, [keyToUpdate]: newValue };
      setActiveMonsters(updatedMonsters);
    }
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
            onChange={setQuery}
            // onChange={handleSearchChange}
            onClick={clearQuery}
          />
          {query.length > 0 && (
            <SearchResults
              // monsters={debouncedSearchValue}
              monsters={monsterResults}
              onChange={handleAddActiveMonster}
            />
          )}
        </div>
      </div>
      <div className="overflow-y-auto h-full w-full">
        <ul className="w-full flex flex-col space-y-2">
          {sortedMonsters.map((monster) => (
            <li key={monster.id}>
              <MonsterCard
                monster={monster}
                onKill={handleKill}
                onDelete={handleDeleteMonster}
                onInitChange={handleMonsterInitChange}
                onSetCondition={handleMonsterCondition}
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
