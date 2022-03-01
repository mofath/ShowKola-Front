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
        updateDevice: build.mutation({
            query: (device) => ({
                url: `/api/device/${device.id}`,
                method: 'PUT',
                body: device,
            }),
        })
    }),
})

export const { useGetAllDevicesQuery, useGetOneDeviceQuery, useUpdateDeviceMutation } = api