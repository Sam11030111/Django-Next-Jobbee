import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

import { isAuthenticatedUser } from "@/app/utils/isAuthenticated";
import UpdateJob from "@/app/components/job/UpdateJob"
import { JobType } from "@/app/page";

const UpdateJobPage = async ({ params }: { params: { id: string }}) => {  
  const token = cookies().get('accessToken')?.value as string;

  const user = await isAuthenticatedUser(token);

  if (!user) {
    redirect("/login");
  }

  let job: JobType | null = null;

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`);
    job = await res.data.job;
  } catch (error) {
    console.log(error);
  };

  if (!job) {
    return <div className="alert alert-danger">Job not found or an error occurred.</div>;
  }

  return (
    <UpdateJob job={job} access_token={token} />
  )
}

export default UpdateJobPage