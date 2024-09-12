"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

import AuthContext from "@/app/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, isAuthenticated, login } = useContext(AuthContext);  

  useEffect(() => {
    if (error) {
      console.log("From Login Page: ", error);
    }

    if (isAuthenticated && !loading) {
      router.push("/");
    }
  }, [isAuthenticated, error, loading]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ username: email, password });
  }

  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src="/images/login.svg"
              alt="login"
              fill
              objectFit=""
            />
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h2> LOGIN</h2>
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <FaEnvelope />
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="\S+@\S+\.\S+"
                    title="Your email is invalid"
                    required
                  />
                </div>
                <div className="inputBox">
                  <FaKey />
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="loginButtonWrapper">
                <button type="submit" className="loginButton">
                  {loading ? "Authenticating..." : "Login"}
                </button>
              </div>
              <p style={{ textDecoration: "none" }} className="signup">
                New to Jobbee? <Link href="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login