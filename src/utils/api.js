import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RtkQueryConfig} from "../config";

export const api = createApi({
    baseQuery: fetchBaseQuery(RtkQueryConfig),
    reducerPath: 'devidesApi',
    endpoints: (build) => ({
        getAllDevices: build.query({
            query: () => `/api/device`
        }),
    }),
})

export const { useGetAllDevicesQuery } = api