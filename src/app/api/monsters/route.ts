import { NextResponse } from "next/server";

const url = "https://www.dnd5eapi.co/graphql";

export async function POST(request: Request) {
  const query = `
        query {
            monsters(limit:10) {
                name
            }
        }
    `;

  try {
    const res = await fetch("https://www.dnd5eapi.co/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ query }),
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.log(data);
    return NextResponse.json({ data });
  } catch (e) {
    console.log("error!", e);
    console.error(e);
    return new NextResponse("Error", { status: 500 });
  }
}
