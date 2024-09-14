import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import UpdateProfile from "../components/user/UpdateProfile";
import { isAuthenticatedUser } from "../utils/isAuthenticated";

const MePage = async () => {
  const token = cookies().get('accessToken')?.value as string;
  const user = await isAuthenticatedUser(token);  

  if (!user) {
    redirect("/login");
  }

  return (
    <UpdateProfile access_token={token} />
  )
}

export default MePage