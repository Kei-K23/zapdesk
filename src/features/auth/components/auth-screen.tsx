"use client";

import React, { useState } from "react";
import { AuthFlow } from "../type";
import SignInCard from "./sign-in-card";
import SignUpCard from "./sign-up-card";

export default function AuthScreen() {
  const [authFlow, setAuthFlow] = useState<AuthFlow>("signIn");
  return (
    <div className="h-full flex justify-center items-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[450px]">
        {authFlow === "signIn" ? (
          <SignInCard setAuthFlow={setAuthFlow} />
        ) : (
          <SignUpCard setAuthFlow={setAuthFlow} />
        )}
      </div>
    </div>
  );
}
