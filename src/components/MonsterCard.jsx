"use client";

import { useState } from "react";

function MonsterCard({ monster }) {
  const [currHP, setCurrHP] = useState(monster.hit_points);
  const [inputValue, setInputValue] = useState(0);
  console.log(monster);

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
    <div className=" w-full bg-slate-800 rounded-lg p-4 flex items-center justify-between gap-2">
      <input
        className="block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="number"
        // placeholder={monster.init}
        value={monster.init}
      />

      <div className="flex flex-col w-full">
        <h2>{monster.name}</h2>
        <span>{monster.id}</span>

        <span>
          <span className="text-slate-400 mr-2">AC</span>
          {monster.armor_class[0].value}
        </span>
      </div>

      <input
        className="block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        // placeholder={currHP}
        value={currHP}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
    </div>
  );
}

export default MonsterCard;
