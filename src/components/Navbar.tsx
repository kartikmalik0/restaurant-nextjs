"use client"
import React from "react";
import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";
import IsResOpen from "./IsResOpen";
import { useSession } from "next-auth/react";
import { Button } from "@chakra-ui/react";


const Navbar = () => {

  const { data: session } = useSession();

  return (
    <div className=" h-12 fixed top-0  right-0 z-50 left-0 bg-fuchsia-50 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LOGO */}
      <div className="text-xl md:font-bold flex-1 ">

        <Link href="/" className="w-12 md:w-20  lg:w-20 xl:w-20 flex">
          <Image src={"/logo-no-background.png"} alt="" height={"1500"} width={"935"} className=" rounded-full" />
        </Link>

      </div>
      {/* LEFT LINKS */}
      <div className="flex flex-col w-full ">
        <div className="hidden md:flex gap-4 mt-4 flex-1 justify-center">
          <Link href="/">Homepage</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/contact-us">Contact</Link>
        </div>
        <p className=" text-center text-[0.6rem]">Free delivery for orders over ₹500</p>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <UserLinks />
        <Link href={session?.user.isAdmin ? "/add" : "/cart"}>
          {
            !session?.user.isAdmin ?
              <CartIcon /> :
              <Button colorScheme="red">Add product</Button>
          }
        </Link>
        <IsResOpen />
      </div>
    </div>
  );
};

export default Navbar;