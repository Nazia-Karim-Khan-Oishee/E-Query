import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <>
      <div>
        <Link to="/createQuestion">
          <button>Create Question</button>
        </Link>
      </div>
      <div>
        <Link to="/createResource">
          <button>Create Resource</button>
        </Link>
      </div>
    </>
  );
};

export default Profile;
