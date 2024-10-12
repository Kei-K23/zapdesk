"use client";

import React, { useState } from "react";
import { AuthFlow } from "../type";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

export default function AuthScreen() {
  const [authFlow, setAuthFlow] = useState<AuthFlow>("signIn");
  return (
    <div className="absolute top-0 h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center w-full mt-10 pb-10 lg:pb-0 lg:mt-0 px-6 lg:max-w-6xl mx-auto gap-10">
        <div className="w-full md:w-1/2">
          <h1 className="max-w-xl text-2xl md:text-5xl font-bold mb-4">
            <span className="text-violet-500">ZapDesk</span> - Stay Connected.
            Stay Productive.
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            All your conversations, files, and tools in one place.{" "}
            <span className="text-violet-500">ZapDesk</span> makes it easy to
            collaborate and get work done in real-time.
          </p>
        </div>
        <div className="md:h-auto pb-10 lg:pb-0 w-full lg:w-1/2">
          {authFlow === "signIn" ? (
            <SignInCard setAuthFlow={setAuthFlow} />
          ) : (
            <SignUpCard setAuthFlow={setAuthFlow} />
          )}
        </div>
      </div>
    </div>
  );
}
