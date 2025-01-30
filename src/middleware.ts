import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    console.log("User Token:", token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (!token) return false;
        if (token?.is_admin) {
          return [
            "/adminDashboard",
            "/adminProfile",
            "/employeeList",
            "/mealPlan",
            "/profile",
          ].includes(pathname);
        } else {
          return ["/userDashboard", "/userProfile", "/profile"].includes(
            pathname
          );
        }
      },
    },
  }
);

export const config = {
  matcher: [
    "/adminDashboard",
    "/adminProfile",
    "/employeeList",
    "/mealPlan",
    "/userDashboard",
    "/userProfile",
    "/profile",
    "/",
  ],
};
