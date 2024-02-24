import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
// import { PaginatedResponse } from "../Models/pagination";
// import { store } from "../store/configeStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 404:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
    }

    return Promise.reject(error.response);
  }
);

const requests = {
  get: (ulr: string) => axios.get(ulr).then(responseBody),
  post: (ulr: string, body: object) => axios.post(ulr, body).then(responseBody),
  put: (ulr: string, body: object) => axios.put(ulr, body).then(responseBody),
  delete: (ulr: string) => axios.delete(ulr).then(responseBody),
};

const Catalog = {
  list: () => requests.get("products"),
  details: (id: number) => requests.get(`products/${id}`),
};

// const TestErrors = {
//   get400Error: () => requests.get("buggy/bad-request"),
//   get401Error: () => requests.get("buggy/unauthorised"),
//   get404Error: () => requests.get("buggy/not-found"),
//   get500Error: () => requests.get("buggy/server-error"),
//   getValidationError: () => requests.get("buggy/not-validation-error"),
// };

const agent = {
  Catalog,
};

export default agent;
