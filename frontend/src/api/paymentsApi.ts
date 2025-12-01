import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../auth/token"


export interface PaymentData {
    userId: string,
    email: string,
    amount: number,
    plan: string,
    captchaToken?: string
}


export const paymentApiSlice = createApi({
    reducerPath: "paymentApiSlice",
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
      createSubscription: builder.mutation<any, PaymentData>({
        query: (payload) => ({
          url: `/payment`,
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
        useCreateSubscriptionMutation
  } = paymentApiSlice
