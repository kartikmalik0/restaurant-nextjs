"use client"
import { ProductType } from "@/types/types";
import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Loader, Loader2 } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import NoProducts from "@/components/NoProducts";

interface Product {
  id: string;
  createdAt: Date;
  title: string;
  desc: string;
  img: string | null;
  price: number;
  isFeatured: boolean;
  options: any[]; // You may want to define a more specific type for options
  catSlug: string;
}
const fetchProducts = async ({ pageParam = 0, category }: { pageParam?: number, category: string }) => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${base_url}/api/products?cat=${category}&skip=${pageParam}&take=4`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

// export const useProducts = (category: string) => {
//   return useInfiniteQuery(
//     {
//       queryKey: ["products", category],
//       queryFn: ({ pageParam = 0 }) => fetchProducts({ pageParam, category }),
//       initialPageParam: 0,
//       getNextPageParam: (lastPage, allPages) => {
//         if (lastPage.length < 4) {
//           return undefined
//         }
//         return allPages.length + 4
//       }
//     }
//   ) as UseInfiniteQueryResult<Product[] , Error>;
// };
type Props = {
  params: { category: string }
}

const CategoryPage = ({ params }: { params: { category: string } }) => {
  const { category } = params;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    {
      queryKey: ["products", category],
      queryFn: ({ pageParam = 0 }) => fetchProducts({ pageParam, category }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 4) {
          return undefined;
        }
        return allPages.length + 4;
      },
    }
  );

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const products = data?.pages.flat() || [];


  return (
    <div className="flex flex-wrap text-red-500">

      {
        products && products.length !== 0 ? (
          products.map((item: ProductType) => (
            <Link
              className="w-full h-[60vh] border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50"
              href={`/product/${item.id}`}
              key={item.id}
            >
              {item.img && (
                <div className="relative h-[80%]">
                  <Image
                    src={item.img}
                    alt={item.img}
                    fill
                    className="object-contain"
                    priority
                    quality={60}
                  />
                </div>
              )}
              <div className="flex items-center justify-between font-bold">
                <h1 className="text-2xl uppercase p-2">{item.title}</h1>
                <h2 className="group-hover:hidden text-xl">₹{item.price}</h2>
                <button className="hidden group-hover:block uppercase bg-red-500 text-white p-2 rounded-md">Add to Cart</button>
              </div>
            </Link>
          ))) : isLoading ? (
            <div className=" flex items-center justify-center w-full">
              <PageLoader/>
            </div>
          ) : (
          <NoProducts/>
        )
      }

      {isFetchingNextPage && (
        <div className="w-full flex justify-center py-4">
          <Loader2 className=' h-8 w-8 animate-spin text-red-500 ' />
        </div>
      )}
      <div ref={ref}></div>
    </div>
  );
};

export default CategoryPage;