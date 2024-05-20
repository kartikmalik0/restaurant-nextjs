import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
    try {
        const body = await req.json();
        await prisma.isResturantOpen.update({
            where: {
                id: "clw3ekyp40000n2vqhauezkku",
            },
            data: { shopStatus: body },
        });
        return new NextResponse(
            JSON.stringify({ message: "Order has been updated!" }),
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};

export const GET = async () => {
    try {
        const res = await prisma.isResturantOpen.findMany();
        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};
