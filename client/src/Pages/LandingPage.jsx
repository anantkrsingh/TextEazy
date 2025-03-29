import React from "react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/api";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const sid = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sid="));
    if (sid) {
      navigate("/dashboard/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white ">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          ""
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] "></div>
      <div className="relative flex flex-col justify-center items-center gap-5">
        <span className="text-gray-700 text-xm font-bold tracking-tight">
          Introducing Online collaborative text editor
        </span>
        <h1 className="text-black font-extrabold text-8xl relative">
          Text Eazy
        </h1>

        <span className="text-black text-sm font-bold ">
          Introducing{" "}
          <span
            className="text-blue-800 underline-offset-2
"
          >
            Text Eazy
          </span>{" "}
        </span>

        <span className="max-w-lg text-gray-600 text-center">
          Boost productivity with intuitive formatting, secure cloud storage,
          and integrated version control for effortless teamwork.
        </span>
        <button
          onClick={handleGetStarted}
          className="px-12 cursor-pointer py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
