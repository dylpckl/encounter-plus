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

export default function SearchBar({ query, onChange, onClick }) {


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
    <div className="relative rounded-md">
      <input
        type="text"
        value={query}
        placeholder="Search for a monster..."
        onChange={onChange} //handleSearchChange
        className="text-black"
      />
      <button
        onClick={onClick} // clearQuery
        className="absolute right-0 pr-3 text-black inset-y-0"
      >
        x
      </button>
    </div>
  );
}
