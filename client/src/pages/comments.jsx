import React from "react";
import { Card } from "flowbite-react";

const Comments = () => {
  return (
    <div div className="flex justify-center ">
      <div className="ml-30 width-100 bg- from-purple-50 to-blue-400 rounded">
        <h5 className="text-4xl font-bold">Question Title</h5>
        <p className="text-lg mt-4">Question Description</p>
        <img src="https://source.unsplash.com/random/300x250" alt="random" />
      </div>
    </div>
  );
};

export default Comments;
