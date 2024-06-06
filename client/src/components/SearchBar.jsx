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
        color="gray-600"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <button className="btn mt-5">Search</button>
    </form>
  );
}

export default SearchBar;
