import {applyPatch} from 'fast-json-patch';
import _ from 'lodash';
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
        }),
        patchDevice: build.mutation({
            query: (payload) => ({
                url: `/api/device/${payload.device.id}`,
                method: 'PATCH',
                body: payload.body
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Device', id: arg.id }],
            async onQueryStarted({device, body},{dispatch,getState, extra, requestId, queryFulfilled}){
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

export const { useGetAllDevicesQuery, useGetOneDeviceQuery, useUpdateDeviceMutation, usePatchDeviceMutation } = api