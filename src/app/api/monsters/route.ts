import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const name = requestBody.variables.name;
  const variables = { name: name };

  const query = `
    query Monsters($name: String) {
      monsters(limit: 500, name: $name) {
        name  
        dexterity
        armor_class {
          value
        }
        hit_points
        damage_immunities
        damage_resistances
        damage_vulnerabilities
        proficiencies {
          value
          proficiency {
            index
          }
        }
      } 
    }
  `;

  try {
    const res = await fetch("https://www.dnd5eapi.co/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ query }),
      body: JSON.stringify({ query: query, variables: variables }),
      cache: "no-store",
    });
    const data = await res.json();
    // console.log(data);

    const monstersWithId = data.data.monsters.map((monster) => ({
      ...monster,
      id: nanoid(),
    }));

    return NextResponse.json(monstersWithId);
    // return NextResponse.json(data.data.monsters);
  } catch (e) {
    // console.log("error!", e);
    console.error(e);
    return new NextResponse({ status: 500 });
  }
}
