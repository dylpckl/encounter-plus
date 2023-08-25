"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

// 
// 
// 
// 
// 

async function getJournalEntries() {
  try {
    const res = await fetch("https://dylansmith.dev/api/journal", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posts = await res.json();
    return posts.posts;
  } catch (e) {
    console.log("Error");
    console.error(e);
  }
  // console.log("POSTS", posts);
}

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(`/?search=${value}`);
    const { target } = e;
    setValue(target.value);
    console.log(value);
  };

  // useEffect(() => {
  //   if(!value) 
    
  //   first
  
  //   return () => {
  //     second
  //   }
  // }, [third])

  return (
    <div>
      <h1>search</h1>
      <input
        type="text"
        value={value}
        placeholder="Search for a monster..."
        onChange={searchHandler}
        // onChange={(e) => setValue(e.target.value)}
        className="text-black"
      />
      <button type="submit">btn</button>
    </div>
  );
}
