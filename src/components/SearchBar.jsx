"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

//
//
//
//
//

// async function getJournalEntries() {
//   try {
//     const res = await fetch("https://dylansmith.dev/api/journal", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });
//     const posts = await res.json();
//     return posts.posts;
//   } catch (e) {
//     console.log("Error");
//     console.error(e);
//   }
//   // console.log("POSTS", posts);
// }

export default function SearchBar({ query, onChange }) {
  // const router = useRouter();
  // const [value, setValue] = useState("");

  // const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   router.push(`/monster/search=${value}`);
  //   const { target } = e;
  //   setValue(target.value);
  //   console.log(value);
  // };

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const res = await fetch(`/api/monsters/search?query=${value}`);
  //   const monster = await res.json();
  // };

  return (
    <div>
      <h1>search</h1>
      <input
        type="text"
        value={query}
        placeholder="Search for a monster..."
        onChange={onChange}
        // onChange={(e) => setValue(e.target.value)}
        className="text-black"
      />
      <button type="submit">btn</button>
    </div>
  );
}
