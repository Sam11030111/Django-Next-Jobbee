import axios from "axios"
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import JobDetail from "@/app/components/job/JobDetail";

const JobDetailPage = async ({ params }: { params: { id: string }}) => {
  const token = cookies().get('accessToken')?.value;  

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`);
    const job = res.data.job;
    const candidates = res.data.candidates;

    return <JobDetail job={job} candidates={candidates} access_token={token} />;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    } else {
      console.error("Error fetching job details:", error);
      return <div>An error occurred. Please try again later.</div>;
    }
  }
}

export default JobDetailPage