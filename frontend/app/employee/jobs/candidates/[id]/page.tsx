import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import axios from 'axios'

import { JobType } from '@/app/page'
import { isAuthenticatedUser } from '@/app/utils/isAuthenticated'
import JobCandidates from '@/app/components/job/JobCandidates'
import { JobsAppliedType } from '@/app/me/applied/page'

const JobCandidatesPage = async ({ params }: { params: { id: string }}) => {
  const token = cookies().get('accessToken')?.value as string;

  const user = await isAuthenticatedUser(token);
  
  if (!user) {
    redirect("/login");
  }

  let candidatesApplied: JobsAppliedType[] = [];

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/job/${params.id}/candidates/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    candidatesApplied = await res.data;
  } catch (error) {
    console.error("Failed to fetch jobs", error);
  }

  return (
    <JobCandidates candidatesApplied={candidatesApplied} />
  )
}

export default JobCandidatesPage