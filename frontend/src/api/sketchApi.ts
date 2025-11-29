import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../auth/token"

export interface SketchCreationData {
    ok: boolean
    sketchId: string,
    used: number
    limit: number
    remaining: number
}

interface UserId {
    userId: string
}

export const sketchApiSlice = createApi({
    reducerPath: "sketchApiSlice",
    baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_SERVER_HOST,
      prepareHeaders: async (headers) => {
        try {
          // Dynamically import Auth0, outside hooks
          const token = getToken()
          if (token) {
            headers.set("authorization", `Bearer ${token}`)
          }
        } catch (error) {
          console.error("Error fetching access token", error)
        }
  
        return headers
      },
    }),
    endpoints: (builder) => ({
      createSketch: builder.mutation<SketchCreationData, UserId>({
        query: (payload) => ({
          url: `/sketches/create-sketch`,
          method: "POST",
          body: payload,
        }),
      }),
    }),
  })
  
  export const {
        useCreateSketchMutation
  } = sketchApiSlice
