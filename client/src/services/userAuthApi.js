import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/auth/' }),

  endpoints: (builder) => ({

    registerUser: builder.mutation({
        query:(userData)=>{
            return {
                url: 'signup',
                method:'POST',
                body: userData,
                headers:{
                    'Content-type': 'application/json',
                    }
                }
            }
        })
    })
})

export const {useRegisterUserMutation} = userAuthApi