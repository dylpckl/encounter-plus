import { NextResponse } from "next/server";

const url = "https://www.dnd5eapi.co/graphql";

// query {
//   monsters(limit: 100) {
//     name
//   }
// }
// 2nd page:
// query {
//   monsters(limit: 100, skip: 100) {
//     name
//   }
// }
// 3rd page:
// query {
//   monsters(limit: 100, skip: 200) {
//     name
//   }
// }

export async function POST(request: Request) {
  // const name = await request.json();
  const requestBody = await request.json();
  const name = requestBody.variables.name;
  const variables = { name: name };
  console.log(requestBody);

  const query = `
    query Monsters($name: String) {
      monsters(limit:25, name: $name) {
        name
    }
  }
    `;

  try {
    const res = await fetch("https://www.dnd5eapi.co/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ query }),
      body: JSON.stringify({ query: query, variables: variables }),
    });
    const data = await res.json();
    console.log(data);
    return NextResponse.json({ data });
    // return NextResponse.json(data.data.monsters);
  } catch (e) {
    // console.log("error!", e);
    console.error(e);
    return new NextResponse({ status: 500 });
  }
}
