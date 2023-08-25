import React from "react";

function ActiveMonsters({ monsters }) {
  const sortedMonsters = monsters.sort((a, b) => b.init - a.init);
  return (
    <>
      <ul>
        <h2>these monsters are active:</h2>
        {sortedMonsters.map((monster) => (
          <li key={monster.name}>
            <span>{monster.name}</span>
            <span>{monster.init}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ActiveMonsters;
