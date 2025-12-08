import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../auth/token"


export interface PaymentData {
    userId: string,
    email: string,
    amount: number,
    plan: string,
    captchaToken?: string
}

export interface VerifyPaymentData {
    userId: string
    subscriptionId: string
    collectionStatus: 'approved' | 'pending' | 'rejected'
}

export interface CancelSubscriptionData {
    userId: string
    subscriptionId: string
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
      verifyPayment: builder.mutation<any, VerifyPaymentData>({
        query: (payload) => ({
          url: `/verify-payment`,
          method: "POST",
          body: payload,
        }),
      }),
      cancelSubscription: builder.mutation<any, CancelSubscriptionData>({
        query: (payload) => ({
          url: `/cancel-subscription`,
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
        useCreateSubscriptionMutation,
        useVerifyPaymentMutation,
        useCancelSubscriptionMutation
  } = paymentApiSlice
