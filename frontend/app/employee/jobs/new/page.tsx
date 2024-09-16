import { cookies } from "next/headers"
import { redirect } from "next/navigation";

import NewJob from "@/app/components/job/NewJob"
import { isAuthenticatedUser } from "@/app/utils/isAuthenticated";

const PostNewJobPage = async () => {
  const token = cookies().get('accessToken')?.value as string;

  const user = await isAuthenticatedUser(token);

  if (!user) {
    redirect("/login");
  }

  return (
    <NewJob access_token={token} />
  )
}

export default PostNewJobPage