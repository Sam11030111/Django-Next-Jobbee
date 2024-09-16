import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import axios from "axios";

import MyJobs from "@/app/components/job/MyJobs";
import { isAuthenticatedUser } from "@/app/utils/isAuthenticated";
import { JobType } from "@/app/page";

const MyJobsPage = async () => {
  const token = cookies().get('accessToken')?.value as string;

  const user = await isAuthenticatedUser(token);

  if (!user) {
    redirect("/login");
  }

  let jobs: JobType[] = [];

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me/jobs/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    jobs = await res.data;
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }

  return (
    <MyJobs jobs={jobs} access_token={token} />
  )
}

export default MyJobsPage