import MonsterCard from "@/components/MonsterCard";

function ActiveMonsters({ monsters }) {
  const sortedMonsters = monsters.sort((a, b) => b.init - a.init);
  return (
    <>
      <ul className="flex flex-col space-y-2">
        <h2>these monsters are active:</h2>
        {sortedMonsters.map((monster) => (
          <li key={monster.id}>
            <MonsterCard monster={monster} />
            {/* <span>{monster.name}</span>
            <span>{monster.init}</span> */}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ActiveMonsters;
