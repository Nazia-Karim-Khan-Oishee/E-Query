import React, { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
      <div className="flex items-center ">
        <TextInput
          color="gray-600"
          type="text"
          className="w-1/4"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for topic..."
        />
        <button className=" mb-2 ">
          {/* Search */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-2xl mt-2 text-blue-500"
          />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
