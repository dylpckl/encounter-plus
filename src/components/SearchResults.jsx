import { Combobox } from "@headlessui/react";
import { useState } from "react";

function SearchResults({ monsters, onChange }) {
  const [selectedMonster, setSelectedMonster] = useState(monsters[0]);
  // console.log(monsters);
  return (
    <>
      {/* <ul className="bg-teal-300 text-black z-20 w-full">
        {monsters.map((monster) => (
          <li
            className="flex"
            key={monster.name}
            onClick={() => onChange(monster)}
          >
            <span>{monster.name}</span>
          </li>
        ))}
      </ul> */}
      {/* <Combobox
        value={selectedPerson}
        onChange={setSelectedPerson}
      >
        <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
        <Combobox.Options>
          {filteredPeople.map((person) => (
            <Combobox.Option
              key={person}
              value={person}
            >
              {person}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox> */}
    </>
  );
}

export default SearchResults;
