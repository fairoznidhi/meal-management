import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // const token = req.nextauth.token;
    // console.log("User Token:", token);
    // if(token){
    //   if(token?.is_admin){
    //     return NextResponse.redirect(new URL("/adminDashboard", req.url));
    //   }
    //   else{
    //     return NextResponse.redirect(new URL("/userDashboard", req.url));
    //   }
    // }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (!token) return false;
        if (token?.is_admin) {
          return [
            "/profile",
            "/adminDashboard",
            "/adminmealPlan",
            "/employeeList",
            "/MealHistory",
            "/mealUpdate",
            "/menuPlan",
            "/userDashboard",
            "/UserMealHistory",
            "/UserMealUpdate",
          ].includes(pathname);
        } else {
          return [
            "/profile",
            "/userDashboard",
            "/UserMealHistory",
            "/UserMealUpdate",
          ].includes(pathname);
        }
      },
    },
  }
);

export const config = {
  matcher: [
    "/profile",
    "/adminDashboard",
    "/adminmealPlan",
    "/employeeList",
    "/MealHistory",
    "/mealUpdate",
    "/menuPlan",
    "/userDashboard",
    "/UserMealHistory",
    "/UserMealUpdate",
    "/",
  ],
};
