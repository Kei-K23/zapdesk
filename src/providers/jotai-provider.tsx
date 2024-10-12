import { Provider } from "jotai";
import React from "react";

export default function JotaiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
