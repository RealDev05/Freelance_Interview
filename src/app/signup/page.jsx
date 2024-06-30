"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

async function userExist(username) {
  const res = await fetch("/api/checkUser", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
  return (await res.json()).exists;
}

export default function SignUpPage() {
  const router = useRouter();

  return (
    <>
      <div className="bg-[rgba(185,203,239,255)] w-full min-h-screen pt-10 text-black">
        <div className="flex flex-col items-center w-full">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col lg:flex-row w-11/12 lg:w-9/12 mt-24 lg:mt-48 p-3 lg:px-8">
            <div className="lg:w-2/5 text font-['Poppins'] pt-4 flex flex-col text-4xl mt-4 mb-6">
              <div className="text-center font-bold">Sign Up</div>
              <span className="text-[16px] font-light mt-10 text-[rgba(76,76,77,100)] text-center">
                Welcome back! Please log in to access your account.
              </span>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  let proceed = true;

                  if (event.target.username.value.trim() === "") {
                    proceed = false;
                  }
                  if (await userExist(event.target.username.value)) {
                    proceed = false;
                  }
                  if (event.target.firstname.value.trim() === "") {
                    proceed = false;
                  }
                  if (event.target.mobile.value.trim() === "") {
                    proceed = false;
                  }
                  if (event.target.pswd.value.trim() === "") {
                    proceed = false;
                  }
                  if (
                    event.target.pswd.value !== event.target.confirmpswd.value
                  ) {
                    proceed = false;
                  }
                  if (!proceed) return;

                  const res = await fetch("/api/createAccount", {
                    method: "POST",
                    body: JSON.stringify({
                      username: event.target.username.value,
                      firstname: event.target.firstname.value,
                      lastname: event.target.lastname.value,
                      mobile: event.target.mobile.value,
                      email: event.target.email.value,
                      password: event.target.pswd.value,
                    }),
                  });
                  const response = await res.json();
                  if (response.error) {
                    console.error(response.error);
                    return alert("Something went wrong, please try again.");
                  }
                  const token = response.token;
                  localStorage.setItem("token", token);

                  const authResponse = await fetch("/api/auth", {
                    method: "POST",
                    body: JSON.stringify({
                      token: localStorage.getItem("token"),
                    }),
                  });
                  const authResult = await authResponse.json();
                  if (authResult.auth) {
                    router.push("/home");
                  } else {
                    alert(authResult.message);
                  }
                }}
              >
                <div className="mt-12 font-light text-[16px]">Username</div>
                <input
                  type="text"
                  className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                  placeholder="Username"
                  name="username"
                />
                <div className="mt-4 font-light text-[16px]">First Name</div>
                <input
                  type="text"
                  className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                  placeholder="First Name"
                  name="firstname"
                />
                <div className="mt-4 font-light text-[16px]">Last Name</div>
                <input
                  type="text"
                  className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                  placeholder="Last Name"
                  name="lastname"
                />
                <div className="mt-4 font-light text-[16px]">Mobile Number</div>
                <input
                  type="text"
                  className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                  placeholder="Mobile Number"
                  name="mobile"
                />
                <div className="mt-4 font-light text-[16px]">Email</div>
                <input
                  type="email"
                  className="bg-[rgba(241,241,241,50)] text-sm w-full p-4 rounded-[4px]"
                  placeholder="Email"
                  name="email"
                />
                <div className="mt-4 font-light text-[16px]">Password</div>
                <div className="relative flex flex-row justify-between">
                  <input
                    type={"password"}
                    className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                    placeholder="Password"
                    name="pswd"
                  />
                </div>
                <div className="mt-4 font-light text-[16px]">
                  Confirm Password
                </div>
                <input
                  type="password"
                  className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
                  placeholder="Confirm Password"
                  name="confirmpswd"
                />
                <div className="pt-14 pb-6 flex flex-row justify-center">
                  <input
                    type="submit"
                    className="bg-[rgba(4,2,105,100)] rounded-[5px] text-white text-[18px] px-24 font-regular"
                    value="Sign Up"
                  />
                </div>
              </form>
            </div>
            <div className="hidden lg:block bg-gray-400 w-[1px] h-full ml-3"></div>
          </div>
        </div>
      </div>
    </>
  );
}
