"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import slide1 from "../../public/slide1.png";
import slide2 from "../../public/slide2.png";
import slide3 from "../../public/slide3.jpg";

const data = [
    {
        id: 1,
        title: "always fresh & always crispy & always hot",
        image: slide1,
    },
    {
        id: 2,
        title: "we deliver your order wherever you are in NY",
        image: slide2,
    },
    {
        id: 3,
        title: "the best pizza to share with your family",
        image: slide3,
    },
];

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () =>
                setCurrentSlide((prev) =>
                    prev === data.length - 1 ? 0 : prev + 1
                ),
            4000
        );
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex  flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row bg-fuchsia-50">
            {/* TEXT CONTAINER */}
            <div className="flex-1 flex items-center justify-center flex-col gap-8 text-red-500 font-bold">
                <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
                    {data[currentSlide].title}
                </h1>
                <Link href={"/menu"}>
                    <button className="bg-red-500 text-white py-4 px-8">
                        Order Now
                    </button>
                </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="w-full flex-1 relative">
                <Image
                    src={data[currentSlide].image}
                    alt="Slide Image"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    priority
                />
            </div>
        </div>
    );
};

export default Slider;
