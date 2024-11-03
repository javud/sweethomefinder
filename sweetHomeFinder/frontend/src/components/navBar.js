// src/components/navBar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import logo from "../assets/logo-no-background.png";
import Search from "./Search";
import "../styles/navBar.scss";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch(
            `http://localhost:5001/api/users/check-admin?clerkUserId=${user.id}`
          );
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [isSignedIn, user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Sweet Home Finder" draggable="false" />
        </div>

        <div
          className={`menu-btn ${isOpen ? "close" : ""}`}
          onClick={toggleMenu}
        >
          <div className="btn-line"></div>
          <div className="btn-line"></div>
          <div className="btn-line"></div>
        </div>

        <ul className={`navbar-links ${isOpen ? "show" : "hide"}`}>
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <SignedIn>
            <li>
              <Link to={isAdmin ? "/admin" : "/quiz"} onClick={toggleMenu}>
                {isAdmin ? "Admin Portal" : "Find Your Pet"}
              </Link>
            </li>
          </SignedIn>
          <li>
            <Link to="/about-us" onClick={toggleMenu}>
              About Us
            </Link>
          </li>

          <li>
            <Search />
          </li>

          <SignedOut>
            <li>
              <SignInButton mode="modal">
                <button className="custom-signin-btn">Login</button>
              </SignInButton>
            </li>
          </SignedOut>

          <SignedIn>
            <li>
              <UserButton />
            </li>
          </SignedIn>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;