"use client";

import { ForwardRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function SearchBar({ query, onChange, onClick }) {
  return (
    <div className="w-full relative rounded-md">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={query}
        placeholder="Search for a monster..."
        onChange={(e) => onChange(e)} //handleSearchChange
        // onChange={onChange} //handleSearchChange
        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
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

// export default SearchBar
