import axios from "axios";

export const isAuthenticatedUser = async (access_token: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/token/verify/`,
      {
        token: access_token,
      }
    );

    if (response.status === 200) return true;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};