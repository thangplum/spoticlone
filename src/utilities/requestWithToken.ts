import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

const requestWithToken = (
  endpoint: string,
  access_token: string,
  cancelSource: CancelTokenSource
) => {
  const request = async () => {
    const cancelToken = cancelSource.token;
    const options = {
      url: endpoint,
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
      cancelToken,
    } as AxiosRequestConfig;
    let result;
    try {
      result = await axios(options);
    } catch (err) {
      if (axios.isCancel(err)) return;
      return err;
    }
    return result;
  };

  return request;
};

export default requestWithToken;
