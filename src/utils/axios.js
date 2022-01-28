import axios from 'axios';
import {axiosConfig} from "../config";

const axiosInt = axios.create(axiosConfig);
axiosInt.interceptors.request.use(
    (request) => request)
axiosInt.interceptors.response.use(
  (response) => response
  ,
  (error) => {
      console.log(error.response)
      Promise.reject(
          (error.response && error.response.data) || 'There is an error!'
      )
  }
);

export default axiosInt;
