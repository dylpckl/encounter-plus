// "use client";

import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import Monsters from "@/components/Monsters";
// import { useState, useEffect } from "react";

async function getMonsters() {
  const res = await fetch("http://localhost:3000/api/monsters", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("failed to fetch monsters");
  }
  const monsters = await res.json();
  return monsters.data.data.monsters;
}

export default async function Home() {
  const monsters = await getMonsters();
  console.log(monsters);
  // const [monsters, setMonsters] = useState([]);

  // useEffect(() => {
  //   const getMonsters = async () => {
  //     const response = await fetch("/api/monsters", { method: "POST" });

  //     const monsters = await response.json();
  //     // console.log(monsters);
  //     setMonsters(monsters.data.data.monsters);
  //   };

  //   getMonsters();
  // }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar />
      <Monsters monsters={monsters} />
    </main>
  );
}
