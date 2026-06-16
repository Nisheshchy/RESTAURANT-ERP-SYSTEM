/** @format */

import React, { useState, useRef, useEffect } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import loginpage from "../assets/loginpage.jpeg";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";

const logos = [logo1, logo2, logo3, logo4, logo5];

export default function SignupPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState(2);
  const squareRef = useRef(null);
  const triangleRef = useRef(null);

  // Form state
  const [restaurantName, setRestaurantName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Basic validation
    if (
      !restaurantName ||
      !fullName ||
      !email ||
      !phoneNo ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    // Handle sign up logic here
    console.log("Sign Up Data:", {
      restaurantName,
      fullName,
      email,
      phoneNo,
      password,
    });
    alert("Account created successfully! (Demo)");
    // You can redirect or call onNavigate to go to sign in
  };

  return (
    <div className="w-screen min-h-screen bg-[#c5daf0] flex items-center justify-center py-10">
      {/* Container framing layout with inner padding */}
      <div className="w-full max-w-5xl bg-white flex flex-col-reverse md:flex-row overflow-hidden shadow-lg rounded-1xl md:rounded-2xl p-4 sm:p-5 mx-4 sm:mx-6 md:mx-8 gap-8 md:gap-12">
        {/* LEFT DECORATIVE SIDEBAR (Red Column) */}
        <div className="w-full md:w-[40%] lg:w-[40%] bg-red-600 rounded-2xl md:rounded-2xl p-6 sm:p-10 flex flex-col">
          {/* IMAGE SECTION */}
          <div className="flex-[3] flex items-center">
            <div className="relative w-full">
              {/* Floating Square */}
              <div
                ref={squareRef}
                className="absolute -top-3 -left-3 w-15 h-12 bg-gray-300 z-0"
                style={{ width: "60px", height: "48px" }}></div>

              {/* Main Image */}
              <div className="w-full rounded-xl overflow-hidden shadow-lg relative z-10">
                <img
                  src={loginpage}
                  alt="Restaurant"
                  className="w-full h-[220px] object-cover"
                />
              </div>

              {/* Triangle */}
              <div
                ref={triangleRef}
                className="absolute bottom-0 right-0 translate-x-4 translate-y-4 z-20 transform rotate-[90deg]">
                <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-md">
                  <polygon points="15,15 95,60 15,100" fill="#cccccc" />
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
              Manage orders, inventory, and billing from one platform. Designed
              to make café operations faster, smarter, and more efficient.
            </p>
          </div>

          {/* LOGO SECTION */}
          <div className="flex-[2] flex flex-col justify-center items-center text-center">
            <h3 className="text-white text-xl font-bold mb-5 text-center">
              Business who Love Restro
            </h3>

            <style>{`
              @keyframes scrollMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: scrollMarquee 12s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Slider track container */}
            <div className="w-full overflow-hidden mb-6 relative masked-overflow">
              <div className="animate-marquee gap-3">
                {[...logos, ...logos].map((logo, index) => {
                  const trueIndex = index % logos.length;
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredLogo(trueIndex)}
                      onClick={() => setHoveredLogo(trueIndex)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-red-100 flex items-center p-1.5 flex-shrink-0 ${
                        hoveredLogo === trueIndex
                          ? "scale-105 shadow-lg border-white opacity-100"
                          : "opacity-80"
                      }`}>
                      <img
                        src={logo}
                        alt={`logo${trueIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {logos.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onMouseEnter={() => setHoveredLogo(index)}
                  onClick={() => setHoveredLogo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    hoveredLogo === index
                      ? "bg-white scale-125"
                      : "border border-white bg-transparent"
                  }`}
                  aria-label={`Logo ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-[60%] lg:w-[95%] p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight leading-none whitespace-nowrap"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            Sign Up to Processed
          </h1>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8">
            <button className="flex-1 flex items-center justify-center gap-3 border border-gray-300 rounded-2xl h-11 sm:h-12 font-semibold hover:bg-gray-50 text-sm sm:text-base cursor-pointer transition-colors">
              <FcGoogle className="text-xl sm:text-2xl" />
              Sign up with Google
            </button>

            <button className="flex-1 flex items-center justify-center gap-3 border border-gray-300 rounded-2xl h-11 sm:h-12 font-semibold hover:bg-gray-50 text-sm sm:text-base cursor-pointer transition-colors">
              <FaApple className="text-xl sm:text-2xl" />
              Sign up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 sm:gap-5 my-4 sm:my-6">
            <div className="flex-1 h-[1px] bg-black"></div>
            <span className="text-lg sm:text-xl font-light">or with email</span>
            <div className="flex-1 h-[1px] bg-black"></div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restaurant Name*/}
            <div>
              <label className="block text-gray-800 font-semibold mb-2"></label>
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 text-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2"></label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 text-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2"></label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 text-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Phone Number*/}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2"></label>
              <input
                type="number"
                placeholder="Phone No"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 text-lg outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2"></label>
              <div className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 flex items-center justify-between focus-within:border-red-500 transition-colors">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700">
                  {showPassword ? (
                    <FaEye className="text-lg" />
                  ) : (
                    <FaEyeSlash className="text-lg" />
                  )}
                </button>
              </div>
            </div>
            {/* Confirm Password*/}
            <div>
              <label className="block text-gray-700 font-semibold mb-2"></label>
              <div className="w-full h-14 border-2 border-gray-300 rounded-xl px-5 flex items-center justify-between focus-within:border-red-500 transition-colors">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? (
                    <FaEye className="text-lg" />
                  ) : (
                    <FaEyeSlash className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignUp}
            className="w-full h-11 sm:h-12 bg-red-600 text-white text-base sm:text-lg rounded-xl mt-5 hover:bg-red-700 font-semibold cursor-pointer transition-colors">
            Sign Up
          </button>

          {/* Footer Navigation */}
          <p className="text-center mt-6 sm:mt-8 text-sm sm:text-lg">
            Already have an account?
            <span
              onClick={onNavigate}
              className="text-red-600 cursor-pointer ml-2 font-semibold hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}