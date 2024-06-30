"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          let proceed = true;
          setPasswordError("");
          setUserNameError("");
          if (event.target.username.value == "") {
            setUserNameError("Username can't be empty");
            proceed = false;
          }
          if (event.target.pswd.value == "") {
            setPasswordError("Password Required");
            proceed = false;
          }
          if (!proceed) {
            return;
          }
          let res;
          try {
            res = await (
              await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                  username: event.target.username.value,
                  password: event.target.pswd.value,
                }),
              })
            ).json();
          } catch (error) {
            console.log(error);
            if (error.message.includes("end", "json", "unexpected")) {
              setPasswordError(
                "Connection issue, something preventing us from connecting"
              );
              return;
            }
            setPasswordError("Something went wrong with connection");
          }

          if (res.error) {
            return setPasswordError(res.error);
          }
          const token = res.token;
          localStorage.setItem("token", token);
          const resp = await (
            await fetch("api/auth", {
              method: "POST",
              body: JSON.stringify({
                token: localStorage.getItem("token"),
              }),
            })
          ).json();
          if (resp.auth) {
            router.push("/home");
          } else {
            alert(resp.messge);
          }
        }}
      >
        <div className="mt-[48px] font-light text-[16px]">Username</div>
        <input
          type="text"
          className="bg-[rgba(241,241,241,50)] text-sm p-4 w-full rounded-[4px]"
          placeholder="Username"
          name="username"
        />
        {/* {userNameError && (
          <div className="text-black text-sm ml-4 text-red-300 mt-4">
            *{userNameError}
          </div>
        )} */}
        <div className="mt-[16px] font-light text-[16px]">Password</div>
        <div className=" relative flex flex-row justify-between">
          <input
            type={"password"}
            className="bg-[rgba(241,241,241,50)] w-full text-sm p-4 rounded-[4px]"
            placeholder="Password"
            name="pswd"
          />
        </div>
        {/* {passwordError && (
          <div className="text-black text-sm ml-4 text-red-300 mt-4">
            *{passwordError}
          </div>
        )} */}
        <div className="text-[12px] flex flex-row justify-end text-[rgba(76,76,77,100)]">
          <a>Forget Password?</a>
        </div>
        <div className="text-[12px] text-[rgba(101,101,103,100)] flex flex-row items-center">
          <input
            type="checkbox"
            className="w-5 h-5 bg-gray-100 border-gray-300"
          ></input>
          <span className="pl-1">Remember me</span>
        </div>
        <div className="pt-14 pb-6 flex flex-row justify-center">
          <button className="bg-[rgba(4,2,105,100)] rounded-[5px]">
            <span className="text-white text-[18px] p-24 font-regular">
              LOGIN
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
