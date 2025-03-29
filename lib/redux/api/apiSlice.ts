import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Puedes agregar headers comunes aquí
      return headers
    },
  }),
  tagTypes: ["Products", "Categories", "User", "Orders"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getUserOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetUserOrdersQuery,
  useCreateOrderMutation,
} = apiSlice

