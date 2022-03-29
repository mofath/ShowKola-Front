import {applyPatch} from 'fast-json-patch';
import {cloneDeep} from 'lodash';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RtkQueryConfig} from "../config";

export const api = createApi({
    baseQuery: fetchBaseQuery(RtkQueryConfig),
    reducerPath: 'devicesApi',
    tagTypes: ['Device', 'selectedDevice','Models'],
    endpoints: (build) => ({
        getAllDevices: build.query({
            query: (payload) => `/api/device${payload ? `?isDeleted=${payload.isDeleted}` : ''}`,
            providesTags: (result) =>
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
        deleteDevices: build.mutation({
            query: (payload) => ({
                url: `/api/device`,
                method: 'DELETE',
                body: payload,
            }),
            invalidatesTags: ['Device']
        }),
        deleteOneDevice: build.mutation({
            query: (deviceId) => ({
                url: `/api/device/${deviceId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg }]
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
        patchDevices: build.mutation({
            query: ({body}) => ({
                url: `/api/device`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['Device'],
            async onQueryStarted(payload,{dispatch, queryFulfilled}){
                console.log(payload);
                const {body, selectedDevices} = payload;
                const {updateQueryData} = api.util;
                const patchResult = dispatch(
                    updateQueryData('getAllDevices',undefined, (draft) => {
                        // Modifier l'item dans la liste générale
                        const modifiedDevices = selectedDevices.map((device) => {
                            let modifiedItem = cloneDeep(device);
                            applyPatch(modifiedItem, body[device.id]);
                            return modifiedItem;
                        });
                        const newList = draft.map(device => {
                            const modifiedDevice = modifiedDevices.find(x => device.id === x.id);
                            return modifiedDevice || device;
                        });
                        Object.assign(draft, newList);

                    })
                )
                queryFulfilled.catch(patchResult.undo);
            }
        }),
        patchDevice: build.mutation({
            query: ({device, body}) => ({
                url: `/api/device/${device.id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg.id }],
            async onQueryStarted({device, body},{dispatch, queryFulfilled}){
                const {updateQueryData} = api.util;
                const patchResult = dispatch(
                    updateQueryData('getAllDevices',undefined, (draft) => {
                        // Modifier l'item dans la liste générale
                        let modifiedItem = cloneDeep(device);
                        applyPatch(modifiedItem, body);
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
    useDeleteDevicesMutation,
    useDeleteOneDeviceMutation,
    useCreateDeviceMutation,
    useUpdateDeviceMutation,
    usePatchDevicesMutation,
    usePatchDeviceMutation,
    useGetModelsQuery } = api