import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { nextUrl, nextauth } = req;
        const { pathname } = nextUrl;
        const { token } = nextauth;
           
        if (pathname.startsWith('/add') && !token?.isAdmin) {
            // Redirect to the home page
            return NextResponse.redirect(new URL('/', req.url));
        }
        // Allow the request to proceed for authorized users
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // Allow users who are logged in
        }
    }
);

export const config = { matcher: ['/add', '/orders', '/cart'] };
