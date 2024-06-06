import React, { useState } from "react";
import { Button, TextInput } from "flowbite-react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Searching forrrrrrrrrrr:", searchTerm);
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <button class="h-10 px-5 my-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
