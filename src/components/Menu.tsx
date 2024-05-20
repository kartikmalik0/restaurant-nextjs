"use client";

import { signOut, useSession } from "next-auth/react";

import { Button, Card, CardBody, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Icon, Image, Input, Text, useDisclosure } from "@chakra-ui/react"
import Link from "next/link";
import React from "react"
import IsResOpen from "./IsResOpen";


const links = [
  { id: 1, title: "Homepage", url: "/", imageUrl: "/homeicon.png" },
  { id: 2, title: "Menu", url: "/menu", imageUrl: "/menuicon.png" },
  { id: 4, title: "Contact", url: "/contact-us", imageUrl: "/phoneicon.png" },
];


function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef(null)
  const { status, data: session } = useSession()


  return (
    <>
      <Image
        src={"/open.png"}
        alt=""
        width={5}
        height={5}
        onClick={onOpen}
        className="cursor-pointer"
      />
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}

      >
        <DrawerOverlay />
        <DrawerContent className=" rounded-bl-2xl ">
          <DrawerCloseButton color={"#fff"} />
          <DrawerHeader background={"#ef4444"} color={"#fff"} className=" underline">MS RESTAURANT</DrawerHeader>
          <DrawerBody background={"#ef4444"}>
            {
              links.map((link, index) => (
                <Card key={index} my={"0.5rem"} onClick={onClose} >
                  <CardBody padding={"0.5rem"}>
                    <Link href={link.url} className="flex items-center ">
                      <Image src={link.imageUrl} alt="menu" h={"20px"} />
                      <Text className="ml-4">{link.title}</Text>
                    </Link>
                  </CardBody>
                </Card>
              ))
            }
            {
              status === "authenticated" ? (
                <Card my={"0.5rem"} onClick={onClose}>
                  <CardBody padding={"0.5rem"}>
                    <Link href="/cart" className="flex items-center  ">
                      <Image src="/carticon.png" alt="cartIcon" h={"20px"} />
                      <Text className="ml-4">Cart</Text>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <></>
              )
            }
            {
              status === "authenticated" ? (
                <Card my={"0.5rem"} onClick={onClose} >
                  <CardBody padding={"0.5rem"}>
                    <Link href="/orders" className=" flex items-center" >
                      <Image src="/ordericon.png" alt="orders" h={"20px"} />
                      <Text className="ml-4">Orders</Text>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <></>
              )
            }
            {
              session?.user.isAdmin ? (
                <Card my={"0.5rem"} onClick={onClose} >
                  <CardBody padding={"0.5rem"}>
                    <Link href="/add" className=" flex items-center" >
                      <Image src="/addproducticon.png" alt="add product" h={"20px"} />
                      <Text className="ml-4">Add Product</Text>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <></>
              )
            }

            <Card my={"0.5rem"} onClick={onClose} >
              <CardBody padding={"0.5rem"}>
                {status == "authenticated" ? (
                  <Link href="/" className=" flex items-center" onClick={() => signOut()} >
                    <Image src="/logouticon.png" alt="logout" h={"20px"} />
                    <Text className="ml-4">Logout</Text>
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center" >
                    <Image src="/loginicon.png" alt="login" h={"20px"} />
                    <Text className="ml-4">Login</Text>
                  </Link>

                )}
              </CardBody>
            </Card>
            <IsResOpen />
          </DrawerBody>
        </DrawerContent>

      </Drawer>

    </>
  )
}
export default Menu;
