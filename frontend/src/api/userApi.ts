import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../auth/token"
import { Usage } from "../store/slices/User"

export interface UserLoginData {
    email: string
    password: string
    repeatPassword?: string
}

export interface UserResponse {
   ok: boolean
   usage: Usage
}

interface UserId {
    userId: string
}

interface Captcha {
  token: string
}

export const userApiSlice = createApi({
    reducerPath: "userApiSlice",
    baseQuery: fetchBaseQuery({
         baseUrl: 'https://motion-back.onrender.com',
      //import.meta.env.VITE_SERVER_HOST,
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
      checkLogin: builder.mutation<UserResponse, UserId>({
        query: (payload) => ({
          url: `/auth/check-login`,
          method: "POST",
          body: payload,
        }),
      }),
      validateCaptcha: builder.mutation<any, Captcha>({
        query: (payload) => ({
          url: `/validate-captcha`,
          method: "POST",
          body: payload,
        }),
      }),
    //   checkUserUsage: builder.query<string, string>({
    //     query: (userId) => ({
    //         url: `/usage/check-usage?userId=${userId}`,
    //         method: "GET",
    //     }),
    //     })
    }),
  })
  
  export const {
        useCheckLoginMutation,
        useValidateCaptchaMutation
        //useLazyCheckUserUsageQuery
  } = userApiSlice
