import { Link } from "@remix-run/react";
import React from "react";

const Navbar = ({ children }) => {
  return (
    <div className="main_container">
      <div className="navbar">
        <div className="navbar_logo">
          <Link to="/">Logo</Link>  
        </div>
        <div className="navbar_links">
          <Link to="/posts">Posts</Link>
        </div>
      </div>
      <div className="container">
      {children}
      </div>
    </div>
  );
};

export default Navbar;
