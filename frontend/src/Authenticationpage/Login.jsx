import React, { useState } from "react";
import {
  FaApple,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import loginpage from "../assets/loginpage.jpeg";

import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";

const logos = [logo1, logo2, logo3, logo4, logo5];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState(2);

  return (
    <div
      className="w-full min-h-screen bg-[#D5E7FF] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-12 overflow-x-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-5xl bg-white flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-none md:rounded-3xl p-3 sm:p-4 md:p-5 min-h-screen md:min-h-0">

        {/* LEFT SIDE */}
        <div className="w-full md:w-[58%] lg:w-[62%] p-5 sm:p-8 md:p-10 flex flex-col justify-center">
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight leading-none"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
            }}
          >
            Sign in to Processed
          </h1>

          <p
            className="text-sm sm:text-base text-black -mt-2 sm:-mt-3 font-bold block pt-1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
            }}
          >
            Welcome back please login !
          </p>
          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6 w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl w-full sm:w-auto px-6 h-12 font-bold hover:bg-gray-50 text-sm cursor-pointer transition-all"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
              }}
            >
              <FcGoogle className="text-3xl" />
              Login with Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl w-full sm:w-auto px-6 h-12 font-bold hover:bg-gray-50 text-sm cursor-pointer transition-all"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
              }}
            >
              <FaApple className="text-3xl" />
              Login with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5 sm:my-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>

            <span
              className="text-xs sm:text-sm text-black font-normal"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
              }}
            >
              or with email
            </span>

            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="info@nepsustech.com"
            className="w-full h-12 border border-gray-300 rounded-xl px-4 text-sm font-medium outline-none focus:border-gray-400"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          />

          {/* Password */}
          <div className="w-full h-12 border border-gray-300 rounded-xl px-4 flex items-center justify-between mt-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="***************************"
              className="w-full outline-none text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-600 hover:text-gray-800 font-bold"
            >
              {showPassword ? (
                <FaEye className="text-xl" />
              ) : (
                <FaEyeSlash className="text-xl" />
              )}
            </button>
          </div>

          {/* Remember */}
          <div
            className="flex flex-row justify-between items-center mt-4 text-xs sm:text-sm w-full"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <label 
              className="flex items-center gap-2 text-black cursor-pointer select-none"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-red-600 cursor-pointer"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-red-600 cursor-pointer font-medium hover:underline whitespace-nowrap"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Forgot Password ?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            className="w-full h-12 bg-[#e50914] hover:bg-red-700 text-white text-base rounded-xl mt-5 mb-4 sm:mb-6 font-semibold cursor-pointer transition-all flex-shrink-0"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Sign In
          </button>

          {/* Sign Up Footer Text */}
          <p
            className="text-center mt-2 sm:mt-4 text-xs sm:text-sm text-black font-bold block clear-both"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
            }}
          >
            Don't have an account ?
            <span
              className="text-red-600 cursor-pointer ml-2 font-bold hover:underline"
              style={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[42%] lg:w-[38%] bg-red-600 rounded-2xl p-5 sm:p-8 flex flex-col justify-between overflow-hidden">

          {/* IMAGE SECTION */}
          <div className="flex-1 flex items-center justify-center pt-2 pb-6">
            <div className="relative w-[85%] sm:w-[80%] md:w-[90%] aspect-[4/3] max-h-[220px]">

              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-[#cccccc] z-0"></div>

              <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl relative z-10 bg-white">
                <img
                  src={loginpage}
                  alt="Restaurant"
                  className="w-full h-full object-cover block"
                />
              </div>

              <div className="absolute -bottom-4 -right-4 z-20 transform rotate-[15deg]">
                <svg
                  viewBox="0 0 100 100"
                  className="w-12 h-12 drop-shadow-md"
                >
                  <polygon
                    points="15,15 85,50 15,85"
                    fill="#cccccc"
                  />
                </svg>
              </div>

            </div>
          </div>

          {/* TEXT SECTION */}
          <div className="text-white text-left mt-2">
            <h2
              className="text-2xl sm:text-3xl font-bold leading-tight text-white"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Brew Success,
              <br />
              Manage with Ease.
            </h2>

            <p
              className="mt-2 text-[10px] sm:text-xs text-white/90 leading-relaxed font-normal"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Manage orders, inventory, and billing from one platform.
              Designed to make cafe operations faster, smarter, and more
              efficient.
            </p>
          </div>

          {/* LOGO SECTION */}
          <div className="mt-6 md:mt-8 overflow-hidden">
            <h3
              className="text-white text-sm sm:text-base font-bold mb-3"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
              }}
            >
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
            <div className="w-full overflow-hidden mb-4 relative masked-overflow">
              <div className="animate-marquee gap-3">
                {[...logos, ...logos].map((logo, index) => {
                  const trueIndex = index % logos.length;
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredLogo(trueIndex)}
                      onClick={() => setHoveredLogo(trueIndex)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-white flex items-center justify-center p-1.5 border flex-shrink-0 ${
                        hoveredLogo === trueIndex
                          ? "scale-105 shadow-lg border-white"
                          : "opacity-80 border-transparent"
                      }`}
                    >
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
      </div>
    </div>
  );
}