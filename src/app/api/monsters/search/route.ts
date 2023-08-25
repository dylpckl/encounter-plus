import { NextResponse } from "next/server";

// params

const monsters = [
  { name: "Acolyte" },
  { name: "Aboleth" },
  { name: "Adult Black Dragon" },
  { name: "Adult Blue Dragon" },
  { name: "Adult Brass Dragon" },
  { name: "Adult Copper Dragon" },
  { name: "Adult Gold Dragon" },
  { name: "Adult Bronze Dragon" },
  { name: "Adult Green Dragon" },
  { name: "Adult Red Dragon" },
];

const query = `
query {
    monsters(limit:10) {
        name
    }
}
`;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(request.url);
  const query = searchParams.get("query");

  const filteredMonsters = monsters.filter((monster) => {
    return monster.name.toLowerCase().includes(query.toLowerCase());
  });

  return NextResponse.json(filteredMonsters);
}
