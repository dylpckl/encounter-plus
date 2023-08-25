function Monsters({ monsters }) {
  //   console.log(monsters);
  return (
    <>
      <h1>monsters????</h1>
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
