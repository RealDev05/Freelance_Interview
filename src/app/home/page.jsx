"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  let { push } = useRouter();
  return (
    <div>
      <div
        onClick={() => {
          if (confirm("Do you really want to logout ?")) {
            localStorage.removeItem("token");
            push("/");
          }
        }}
      >
        Logout
      </div>
    </div>
  );
}
