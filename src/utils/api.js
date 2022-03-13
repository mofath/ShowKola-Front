import {applyPatch} from 'fast-json-patch';
import _ from 'lodash';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RtkQueryConfig} from "../config";

export const api = createApi({
    baseQuery: fetchBaseQuery(RtkQueryConfig),
    reducerPath: 'devicesApi',
    tagTypes: ['Device', 'selectedDevice','Models'],
    endpoints: (build) => ({
        getAllDevices: build.query({
            query: () => `/api/device`,
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Device', id })), 'Device']
                    : ['Device']
        }),
        getModels: build.query({
            query: () => `/api/device/models`,
            providesTags: ['Models'],
        }),
        getOneDevice: build.query({
            query : (id) => `/api/device/${id}`,
            providesTags: ['selectedDevice']
        }),
        createDevice: build.mutation({
            query: (device) => ({
                url: `/api/device`,
                method: 'POST',
                body: device,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg.id },'selectedDevice'],
        }),
        updateDevice: build.mutation({
            query: (device) => ({
                url: `/api/device/${device.id}`,
                method: 'PUT',
                body: device,
            }),
            invalidatesTags: ['Device']
        }),
        patchDevice: build.mutation({
            query: (payload) => ({
                url: `/api/device/${payload.device.id}`,
                method: 'PATCH',
                body: payload.body
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg.id }],
            async onQueryStarted({device, body},{dispatch, queryFulfilled}){
                const patchResult = dispatch(
                    api.util.updateQueryData('getAllDevices',undefined, (draft) => {
                        // Modifier l'item dans la liste générale
                        let modifiedItem = _.cloneDeep(device);
                        const jsonPatchResult = applyPatch(modifiedItem, body);
                        const newList = draft.map(x => x.id === device.id? modifiedItem : x);
                        Object.assign(draft, newList);
                    })
                )
                queryFulfilled.catch(patchResult.undo);
            }
        })
    }),
})

export const { useGetAllDevicesQuery,
    useGetOneDeviceQuery,
    useCreateDeviceMutation,
    useUpdateDeviceMutation,
    usePatchDeviceMutation,
    useGetModelsQuery } = api