"use client";

import { useState } from "react";
// import clsx from "clsx";

const CONDITIONS = [
  "BLND",
  "CHRM",
  "DEAF",
  "FRGHT",
  "GRPL",
  "INCAP",
  "INVIS",
  "PRLZ",
  "PETR",
  "POIS",
  "PRNE",
  "REST",
  "STUN",
  "UNCON",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MonsterCard({ monster, onInitChange, onKill, onDelete }) {
  const [currHP, setCurrHP] = useState(monster.hit_points);
  const [inputValue, setInputValue] = useState(0);
  console.log(monster);

  // const { active } = monster;

  // const init = monster.init.toString();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      const parsedValue = parseInt(inputValue, 10);

      if (!isNaN(parsedValue)) {
        setCurrHP(parsedValue);
      }
    } else if (event.key === "-") {
      setInputValue("-" + inputValue);
      event.preventDefault(); // Prevent the "-" character from being typed in the input
    } else if (event.key === "+") {
      setInputValue("+" + inputValue);
      event.preventDefault(); // Prevent the "+" character from being typed in the input
    }
  };

  return (
    // <div className="backdrop-blur-md bg-slate-800 rounded-lg p-4 flex items-center justify-between gap-2">
    <div
      className={classNames(
        monster.active ? "bg-red-300" : "bg-slate-500",
        "backdrop-blur-md rounded-lg p-4 flex flex-col items-center justify-between gap-2"
      )}
    >
      <div className="flex w-full">
        {/* Init */}
        <div className="mr-2">
          <label
            htmlFor="init"
            className="text-sm"
          >
            Init.
          </label>
          <input
            id="init"
            onChange={(e) => onInitChange(monster, e)}
            className="block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="number"
            value={monster.init}
            min="0"
            step="1"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col w-full">
          <h2 className="">{monster.name}</h2>
          {/* <span>{monster.id}</span> */}

          <span className="text-xs">
            <span className="text-slate-400 mr-2">AC</span>
            {monster.armor_class[0].value}
          </span>
          <ul>
            {monster.damage_resistances.map((resist, index) => (
              <li key={index}>{resist}</li>
            ))}
          </ul>

          {/* <ul>
          {monster.proficiencies.map((prof, index) => {
            let profName = prof.proficiency.index;
            return (
              profName.includes("saving-throw") && (
                <li
                  key={index}
                  className="text-xs"
                >
                  <span className="uppercase">{profName.slice(-3)}</span>
                  {" +"}
                  {prof.value}
                </li>
              )
            );
          })}
        </ul> */}
        </div>

        {/* HP */}
        <div className="">
          <label htmlFor="hp">HP</label>
          <div className="flex items-center">
            <input
              id="hp"
              className="block w-12 h-6 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="number"
              // placeholder={currHP}
              // value={currHP}
              value={monster.hit_points}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            {"/"}
            <span>{monster.maxHP}</span>
          </div>
        </div>

        {/* Buttons */}
        <div>
          <button onClick={() => onKill(monster)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-6 h-6"
            >
              <path d="M368 400c-.4-16 7.3-31.2 20.4-40.4C436.1 326.2 464 276.9 464 224c0-91.4-86.9-176-208-176S48 132.6 48 224c0 52.9 27.9 102.2 75.6 135.6c13.1 9.2 20.8 24.4 20.4 40.4l0 0v64h48V440c0-13.3 10.7-24 24-24s24 10.7 24 24v24h32V440c0-13.3 10.7-24 24-24s24 10.7 24 24v24h48V400l0 0zm48-1.1c0 .4 0 .7 0 1.1v64c0 26.5-21.5 48-48 48H144c-26.5 0-48-21.5-48-48V400c0-.4 0-.7 0-1.1C37.5 357.8 0 294.7 0 224C0 100.3 114.6 0 256 0S512 100.3 512 224c0 70.7-37.5 133.8-96 174.9zM112 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm232-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
            </svg>
          </button>

          <button onClick={() => onDelete(monster)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-6 h-6"
            >
              <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Conditions */}
      <div className="">
        <ul className="flex gap-1 flex-wrap">
          {CONDITIONS.sort().map((cond) => (
            <li key={cond}>
              <button className="bg-slate-600 px-2 py-1 rounded-md text-xs hover:bg-slate-400">
                {cond}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MonsterCard;
