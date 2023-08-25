function Monsters({ monsters }) {
  //   console.log(monsters);
  return (
    <>
      <ul>
        {monsters.map((monster) => (
          <li key={monster.name}>
            <h3>{monster.name}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Monsters;
