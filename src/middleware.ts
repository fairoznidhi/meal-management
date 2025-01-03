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
        console.log("Pathname:", pathname);
        if (token?.is_admin) {
          return ["/adminDashboard", 
                "/adminProfile", 
                "/employeeList",
                "/mealPlan"].includes(pathname);
        } else {
          return ["/userDashboard", 
                  "/userProfile"].includes(pathname);
        }
      },
    },
  }
);

export const config = { 
  matcher: ["/adminDashboard", 
            "/adminProfile", 
            "/employeeList",
            "/mealPlan",
            "/userDashboard", 
            "/userProfile",
          ] 
};
