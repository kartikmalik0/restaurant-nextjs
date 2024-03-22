import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  const { url } = req; // Destructure URL from the request

  // Extract the last ID using a regular expression (more robust)
  const match = url.match(/\/api\/confirm\/([^\/]+)$/);
console.log(match)
  if (!match) {
    return new NextResponse(JSON.stringify({ message: "Invalid URL format" }), { status: 400 });
  }

  const orderId = match[1];

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: { status: "Being prepared!" },
    });
    return new NextResponse(
      JSON.stringify({ message: "Order has been updated" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
