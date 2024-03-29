import React from "react";
import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";
import Notification from "./Notification";

const Navbar = () => {
  return (
    <div className=" h-12 fixed top-0  right-0 z-50 left-0 bg-fuchsia-50 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LOGO */}
      <div className="text-xl md:font-bold flex-1 ">
        
        <Link href="/" className=" w-12 flex">
          <Image src={"/logo-no-background.png"} alt="" height={"60"} width={"60"} className=" rounded-full"/>
        </Link>
        
      </div>
      {/* LEFT LINKS */}
      <div className="flex flex-col w-full ">
      <div className="hidden md:flex gap-4 mt-4 flex-1">
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
        <div className="md:absolute top-3 r-2  flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20}  />
          <span>123 456 78</span>
        </div>
        <UserLinks/>
        <CartIcon />
      </div>
    </div>
  );
};

export default Navbar;