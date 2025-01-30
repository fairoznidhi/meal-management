import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router=useRouter();
  const {data:session}=useSession();
  if (session?.user?.is_admin) {
    router.push("/adminDashboard");
  } else if (!session?.user?.is_admin) {
    router.push("/userDashboard");
  }
  return (
    <div className="m-20 items-center justify-center">
      <p className="text-center text-4xl">Homepage</p>
      
    </div>
  );
}
