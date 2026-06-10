import React, { useState } from "react";
import {
  FaGoogle,
  FaApple,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import loginpage from "../assets/loginpage.jpeg";
import logo1 from "../assets/logo1.svg";
import logo2 from "../assets/logo2.svg";
import logo3 from "../assets/logo3.svg";
import logo4 from "../assets/logo4.svg";
import logo5 from "../assets/logo5.svg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-screen min-h-screen bg-[#c5daf0] flex items-center justify-center">
      {/* 1. Added inner padding here (p-4 sm:p-5) to expose the white canvas framing layout */}
      <div className="w-full max-w-6xl bg-white flex flex-col md:flex-row overflow-hidden shadow-lg rounded-2xl md:rounded-3xl p-4 sm:p-5 mx-4 sm:mx-6 md:mx-8">

        {/* LEFT SIDE */}
        <div className="w-full md:w-[60%] lg:w-[65%] p-6 sm:p-10 md:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
            Sign in to Processed
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 mt-2 sm:mt-3">
            Welcome back please login !
          </p>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-10">
            <button className="flex items-center justify-center gap-3 border border-gray-300 rounded-2xl w-full sm:w-[260px] h-12 sm:h-14 font-semibold hover:bg-gray-50 text-sm sm:text-base cursor-pointer">
              <FaGoogle className="text-2xl sm:text-3xl text-red-500" />
              Login with Google
            </button>

            <button className="flex items-center justify-center gap-3 border border-gray-300 rounded-2xl w-full sm:w-[260px] h-12 sm:h-14 font-semibold hover:bg-gray-50 text-sm sm:text-base cursor-pointer">
              <FaApple className="text-2xl sm:text-3xl" />
              Login with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 sm:gap-5 my-6 sm:my-10">
            <div className="flex-1 h-[1px] bg-black"></div>
            <span className="text-lg sm:text-2xl font-light">or with email</span>
            <div className="flex-1 h-[1px] bg-black"></div>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="info@nepsustech.com"
            className="w-full h-12 sm:h-16 border-2 border-gray-300 rounded-xl px-4 sm:px-6 text-base sm:text-xl outline-none"
          />

          {/* Password */}
          <div className="w-full h-12 sm:h-16 border-2 border-gray-300 rounded-xl px-4 sm:px-6 flex items-center justify-between mt-4 sm:mt-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="***************************"
              className="w-full outline-none text-base sm:text-xl"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? (
                <FaEye className="text-lg sm:text-xl" />
              ) : (
                <FaEyeSlash className="text-lg sm:text-xl" />
              )}
            </button>
          </div>

          {/* Remember */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between mt-4 sm:mt-5 text-sm sm:text-lg">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              Remember me
            </label>

            <button className="text-red-600 text-left sm:text-right cursor-pointer">
              Forgot Password ?
            </button>
          </div>

          {/* Sign In */}
          <button className="w-full h-12 sm:h-14 bg-red-600 text-white text-lg sm:text-2xl rounded mt-5 hover:bg-red-700 font-semibold cursor-pointer">
            Sign In
          </button>

          <p className="text-center mt-6 sm:mt-8 text-sm sm:text-lg">
            Don't have an account ?
            <span className="text-red-600 cursor-pointer ml-2 font-semibold">
              Sign Up
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        {/* 2. Adjusted padding properties, added rounded borders and flex behaviors below */}
{/* RIGHT SIDE */}
<div className="w-full md:w-[40%] lg:w-[35%] bg-red-600 rounded-2xl md:rounded-3xl p-6 sm:p-8 flex flex-col">

  {/* IMAGE SECTION */}
  <div className="flex-[4] flex items-center">
    <div className="relative w-full">
      
      {/* Floating Square */}
      <div className="absolute -top-4 -left-4 w-14 h-14 rounded-xl bg-gray-300 z-10"></div>

      {/* Main Image */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <img
          src={loginpage}
          alt="Restaurant"
          className="w-full h-[220px] object-cover"
        />
      </div>

      {/* Triangle */}
      <div className="absolute bottom-0 right-0 translate-x-4 translate-y-4">
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14"
        >
          <polygon
            points="15,15 85,50 15,85"
            fill="#d1d5db"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* TEXT SECTION */}
  <div className="flex-[3] flex flex-col justify-center text-white">

    <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
      Brew Success,
      <br />
      Manage with Ease.
    </h2>

    <p className="mt-5 text-sm sm:text-base text-white/90 leading-relaxed">
      Manage orders, inventory, and billing from one
      platform. Designed to make café operations
      faster, smarter, and more efficient.
    </p>

  </div>

  {/* LOGO SECTION */}
  <div className="flex-[2] flex flex-col justify-end">

    <h3 className="text-white text-xl font-bold mb-5">
      Business who Love Restro
    </h3>

    {/* Logos */}
    <div className="flex justify-between gap-2">

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white">
        <img
          src={logo1}
          alt="logo1"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white">
        <img
          src={logo2}
          alt="logo2"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white">
        <img
          src={logo3}
          alt="logo3"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white">
        <img
          src={logo4}
          alt="logo4"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white">
        <img
          src={logo5}
          alt="logo5"
          className="w-full h-full object-cover"
        />
      </div>

    </div>

    {/* Dots */}
    <div className="flex justify-center gap-2 mt-6">

      <div className="w-2.5 h-2.5 rounded-full border border-white"></div>

      <div className="w-2.5 h-2.5 rounded-full border border-white"></div>

      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>

      <div className="w-2.5 h-2.5 rounded-full border border-white"></div>

      <div className="w-2.5 h-2.5 rounded-full border border-white"></div>

    </div>

  </div>

  </div>
      </div>
    </div>
  );
}