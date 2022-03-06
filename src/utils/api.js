import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RtkQueryConfig} from "../config";

export const api = createApi({
    baseQuery: fetchBaseQuery(RtkQueryConfig),
    reducerPath: 'devicesApi',
    tagTypes: ['Device', 'selectedDevice'],
    endpoints: (build) => ({
        getAllDevices: build.query({
            query: () => `/api/device`,
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Device', id })), 'Device']
                    : ['Device']
        }),
        getOneDevice: build.query({
            query : (id) => `/api/device/${id}`,
            providesTags: ['selectedDevice']
        }),
        updateDevice: build.mutation({
            query: (device) => ({
                url: `/api/device/${device.id}`,
                method: 'PUT',
                body: device,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg.id },'selectedDevice'],
        })
    }),
})

export const { useGetAllDevicesQuery, useGetOneDeviceQuery, useUpdateDeviceMutation } = api