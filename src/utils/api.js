import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RtkQueryConfig} from "../config";

export const api = createApi({
    baseQuery: fetchBaseQuery(RtkQueryConfig),
    reducerPath: 'devicesApi',
    endpoints: (build) => ({
        getAllDevices: build.query({
            query: () => `/api/device`
        }),
        getOneDevice: build.query({
            query : (id) => `/api/device/${id}`
        }),
    }),
})

export const { useGetAllDevicesQuery, useGetOneDeviceQuery } = api