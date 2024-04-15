"use client";

import PageLoader from "@/components/PageLoader";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { compareAsc, parseISO, } from 'date-fns';



const OrdersPage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession()
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const [sound, setSound] = useState<any>(null);
  const [previousData, setPreviousData] = useState<OrderType[]>([]);

  useEffect(() => {
    // Create Audio instance only on the client-side

    if (session?.user?.isAdmin) {
      if (!sound) {
        const newSound = new Audio("/order.mp3");
        setSound(newSound);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  if (status === "unauthenticated") {
    router.push("/")
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      fetch(`${base_url}/api/orders`).then((res) =>
        res.json(),
      ),
    staleTime: 0,
    refetchInterval: 1000 * 10,
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`${base_url}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;
    mutation.mutate({ id, status });
    toast.success("The order status has been changed!")
  };

  useEffect(() => {
    if (session?.user?.isAdmin) {
      if (previousData.length > 0 && data) {
        const previousOrderIds = new Set(previousData.map((order) => order.id));
        const newOrders = data.filter(
          (order: OrderType) => !previousOrderIds.has(order.id)
        );

        if (newOrders.length > 0) {
          sound.play();
          console.log('new order created')
        }
      }
      setPreviousData(data || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session]);

  if (isPending || status === "loading") return <PageLoader />
  const sortedData = data?.sort((a: any, b: any) => {
    try {
      const dateA = parseISO(a?.cretedAt);
      const dateB = parseISO(b?.cretedAt);
      return compareAsc(dateB, dateA)
    } catch (error) {
      console.error("Invalid date format:", a.createdAt, b.createdAt);
      // Decide how to handle invalid dates (e.g., place them at the end)
      return 1; // Place invalid dates at the bottom by default
    }
  });

  return (
    <div className="p-2 lg:px-8 xl:px-8 mt-12 md:mt-24 lg:mt-24 xl:mt26">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            {
              session?.user.isAdmin ? (
                <>
                  <th className="hidden md:block">Payment ID</th>
                  <th>Name</th>
                  <th>Mobile No.</th>
                  <th>Date</th>
                </>
              ) : <></>
            }
            <th>Price</th>
            <th className="">Products</th>
            {
              session?.user.isAdmin ? (
                <th>Address</th>
              ) : <></>
            }
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            sortedData.length > 0 ? (sortedData?.map((item: OrderType, index: any) => (
              <tr className={`text-sm md:text-base  ${item?.status === "delivered" ? "bg-green-100 " : "bg-red-50"}`} key={index}>
                {
                  session?.user.isAdmin ?
                    <td className="hidden md:block py-6 px-1">{item?.orderInfo[0]?.paymentId}</td>
                    : <></>
                }
                {
                  session?.user.isAdmin ?
                    <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.name}</td>
                    : <></>
                }
                {
                  session?.user.isAdmin ?
                    <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.phoneNumber}</td>
                    : <></>
                }
                {
                  session?.user.isAdmin ? (
                    <td className="py-6 px-1">{item?.cretedAt?.toString().slice(0, 10)}</td>
                  ) : <></>
                }
                <td className="py-6 px-1">₹{item?.price}</td>
                <td className=" py-6 px-1">
                  {item?.products.map((product: any) => (
                    <div key={product.id}>
                      {`${product.title} (${product.optionTitle}) * ${product.quantity}`}
                    </div>
                  ))}
                </td>
                {
                  session?.user.isAdmin ?
                    <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.address}</td>
                    : <></>
                }
                {session?.user.isAdmin ? (
                  <td>
                    <form
                      className="flex items-center justify-center gap-4"
                      onSubmit={(e) => handleUpdate(e, item.id)}
                    >
                      <input
                        placeholder={item.status}
                        className="p-2 ring-1 ring-red-100 rounded-md"
                      />
                      <button className="bg-red-400 p-2 rounded-full">
                        <Image src={"/edit.png"} alt="" width={30} height={30} />
                      </button>
                    </form>
                  </td>
                ) : (
                  <td className="py-6 px-1">{item.status}</td>
                )}
              </tr>
            ))
            ) : <>
              <div className="w-full ">
                <h1 className="mx-auto text-2xl text-red-500 font-bold">No Orders</h1>
              </div>
            </>
          }
        </tbody>

      </table>
    </div>
  );
};

export default OrdersPage;