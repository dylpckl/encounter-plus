function SearchResults({ monsters, onChange }) {
  //   console.log(monsters);
  return (
    <>
      <ul className="bg-teal-300 text-black">
        {monsters.map((monster) => (
          <li
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
