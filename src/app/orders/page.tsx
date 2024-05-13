"use client";

import PageLoader from "@/components/PageLoader";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { compareAsc, parseISO, } from 'date-fns';
import {  Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,Select } from "@/components/ui/select";



const OrdersPage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession();
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

  const handleUpdate = (e:string,id:string) => {
    const status = e;
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
      <TableContainer>
        <Table className="w-full border-separate border-spacing-3">
          <Thead>
            <Tr className="text-left">
              {
                session?.user.isAdmin ? (
                  <>
                    <Th className="hidden md:block">Payment ID</Th>
                    <Th>Name</Th>
                    <Th>Mobile No.</Th>
                    <Th>Date</Th>
                  </>
                ) : <></>
              }
              <Th>Price</Th>
              <Th className="">Products</Th>
              {
                session?.user.isAdmin ? (
                  <Th>Address</Th>
                ) : <></>
              }
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              sortedData.length > 0 ? (sortedData?.map((item: OrderType, index: any) => (
                <Tr className={`text-sm md:text-base mb-2 ${item?.status === "Delivered" ? "bg-green-100 " : "bg-red-50"}`} key={index}>
                  {
                    session?.user.isAdmin ?
                      <Td className="hidden md:block ">{item?.orderInfo[0]?.paymentId}</Td>
                      : <></>
                  }
                  {
                    session?.user.isAdmin ?
                      <Td >{item?.orderInfo[0]?.addressInfo?.name}</Td>
                      : <></>
                  }
                  {
                    session?.user.isAdmin ?
                      <Td >{item?.orderInfo[0]?.addressInfo?.phoneNumber}</Td>
                      : <></>
                  }
                  {
                    session?.user.isAdmin ? (
                      <Td >{item?.cretedAt?.toString().slice(0, 10)}</Td>
                    ) : <></>
                  }
                  <Td >₹{item?.price}</Td>
                  <Td >
                    {item?.products.map((product: any) => (
                      <p key={product.id}>
                        {`${product.title} (${product.optionTitle}) * ${product.quantity}`}
                      </p>
                    ))}
                  </Td>
                  {
                    session?.user.isAdmin ?
                      <Td >{item?.orderInfo[0]?.addressInfo?.address}</Td>
                      : <></>
                  }
                  {session?.user.isAdmin ? (
                    <Td>
                        <Select onValueChange={(e) => handleUpdate(e,item.id)} >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder={item?.status} />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                            <SelectGroup>
                                <SelectLabel></SelectLabel>
                                <SelectItem value="Out for delivery" className=" cursor-pointer" >Out for delivery</SelectItem>
                                <SelectItem value="Delivered" className=" cursor-pointer" >Delivered</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </Td>
                  ) : (
                    <Td >{item.status}</Td>
                  )}
                </Tr>
              ))
              ) : <>
                <div className="w-full ">
                  <h1 className="mx-auto text-2xl text-red-500 font-bold">No Orders</h1>
                </div>
              </>
            }
          </Tbody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default OrdersPage;