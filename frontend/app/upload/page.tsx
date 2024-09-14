import { cookies } from 'next/headers';

import UploadResume from "../components/user/UploadResume"

const UploadPage = () => {
  const token = cookies().get('accessToken')?.value as string;

  return (
    <UploadResume access_token={token} /> 
  )
}

export default UploadPage