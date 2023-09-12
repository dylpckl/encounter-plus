"use client";

export default function SearchBar({ query, onChange, onClick }) {
  return (
    <div className="relative rounded-md">
      <input
        type="text"
        value={query}
        placeholder="Search for a monster..."
        onChange={(e) => onChange(e.target.value)} //handleSearchChange
        // onChange={onChange} //handleSearchChange
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
