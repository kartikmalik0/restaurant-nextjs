import Image from "next/image";
import React from "react";

const EmptyCart = () => {
    return (
        <div className="flex items-center justify-center w-full flex-col">
            <Image src="/emptyCart.webp" alt="emptyCart" />
            <h1 className=" text-3xl font-bold text-black">
                Your Cart is <span className=" text-red-500">Empty!</span>
            </h1>
            <p className=" text-gray-600 font-normal my-4">
                Must add items to proceed to Checkout
            </p>
            <a
                href="/menu"
                className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
                data-primary="green-400"
                data-rounded="rounded-2xl"
                data-primary-reset="{}"
            >
                Start Order
                <svg
                    className="w-4 h-4 ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    ></path>
                </svg>
            </a>
        </div>
    );
};

export default EmptyCart;
