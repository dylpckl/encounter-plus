function SearchResults({ monsters, onChange }) {
  console.log(monsters);
  return (
    <>
      <ul className="bg-teal-300 text-black absolute z-20 w-full">
        {monsters.map((monster) => (
          <li
          className=""
            key={monster.name}
            onClick={() => onChange(monster)}
          >
            <h3>{monster.name}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SearchResults;
