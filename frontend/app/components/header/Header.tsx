"use client";

import { useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import DropdownButton from 'react-bootstrap/DropdownButton';

import AuthContext from "@/app/context/AuthContext"

const Header = () => {
  const { loading, user, logout } = useContext(AuthContext);  

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="navWrapper">
      <div className="navContainer">
        <Link href="/">
          <div className="logoWrapper">
            <div className="logoImgWrapper">
              <Image width="50" height="50" src="/images/logo.png" alt="" />
            </div>
            <div>
              <span className="logo1">Job</span>
              <span className="logo2">bee</span>
            </div>
          </div>
        </Link>
        <div className="btnsWrapper">
          <Link href="/employeer/jobs/new">
            <button className="postAJobButton">
              <span>Post A Job</span>
            </button>
          </Link>

          {user ? (
            <DropdownButton id="dropdown-basic-button" title={`Hi, ${user.first_name}`} className="ms-4">
              <Link href="/employeer/jobs" className="dropdown-item">
                My Jobs
              </Link>

              <Link href="/me/applied" className="dropdown-item">
                Jobs Applied
              </Link>

              <Link href="/me" className="dropdown-item">
                Profile
              </Link>

              <Link href="/upload" className="dropdown-item">
                Upload Resume
              </Link>

              <div onClick={handleLogout} className="dropdown-item">
                  Logout
              </div>
            </DropdownButton>
          ) : (
            !loading && (
              <Link href="/login">
                <button className="loginButtonHeader">
                  <span>Login</span>
                </button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Header