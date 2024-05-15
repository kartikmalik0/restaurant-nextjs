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
  return (
    
      <div className="flex item-center">
        {
          !session?.user.isAdmin && 
          <div className="relative flex h-4 w-4 md:w-8 md:h-12">
            <Image
              src="/carticon.png"
              alt="carticon"
              fill
              sizes="100%"
              className="object-contain"
            />
            {totalItems > 0 && <span className=" absolute bg-[#fff] top-[-0.1rem] right-[-1.1rem] px-2 rounded-full">{totalItems >= 9 ? "9+" : totalItems}</span>}
          </div> 
        }

      </div>
    
  );
};

export default CartIcon;