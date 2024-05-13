"use client"
import { useCartStore } from "@/utils/store";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const CartIcon = () => {
  const { data: session } = useSession();

  const { totalItems } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])
  return (
    <Link href={session?.user.isAdmin ? "/add" : "/cart"}>
      <div className="flex items-center gap-4">
        {
          !session?.user.isAdmin ? <div className="relative   md:w-8 md:h-12">
            <Image
              src="/carticon.png"
              alt=""
              fill
              sizes="100%"
              className="object-contain"
            />
          </div> : <Button colorScheme="red">Add product</Button>
        }

      </div>
    </Link>
  );
};

export default CartIcon;