import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import axios from "axios";

import { JobType } from "@/app/page";
import { isAuthenticatedUser } from "@/app/utils/isAuthenticated";
import JobsApplied from "@/app/components/job/JobApplied";

export type JobsAppliedType = {
    user: number;
    resume: string;
    appliedAt: string;
    job: JobType;
};

const AppliedPage = async () => {
  const token = cookies().get('accessToken')?.value as string;

  const user = await isAuthenticatedUser(token);

  if (!user) {
    redirect("/login");
  }

  let jobs: JobsAppliedType[] = [];

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me/jobs/applied/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    jobs = await res.data;
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }
  
  return (
    <JobsApplied jobs={jobs} />
  )
}

export default AppliedPage