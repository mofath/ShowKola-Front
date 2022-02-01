import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const axiosInt = axios.create();
axiosInt.interceptors.request.use(
    (request) => {
        console.log("REQUEST STARTED");
        return request;
    }
)
axiosInt.interceptors.response.use(
  (response) => {

      console.log("REQUEST FINISHED");
      return response;
  },
  (error) => {
      console.log("REQUEST ERROR",error.response)
      Promise.reject(
          (error.response && error.response.data) || 'There is an error!'
      )
  }
);

export const mock = new AxiosMockAdapter(axiosInt, { delayResponse: 1000 });

export default axiosInt;
