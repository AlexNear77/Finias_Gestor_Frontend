/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ProductSize {
  id?: string;
  size: string;
  stockQuantity: number;
  productId?: string;
}

export interface Branch {
  branchId: string;
  name: string;
  location: string;
}

export interface Product {
  imageUrl: string;
  productId: string;
  name: string;
  price: number;
  rating?: number;
  description?: string;
  gender?: string;
  createdAt: string;
  sizes?: ProductSize[];
  branchId?: string;
  branch?: Branch;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  description?: string;
  gender?: string;
  sizes?: {
    size: string;
    stockQuantity: number;
  }[];
  branchId?: string;
}

export interface UpdateProduct {
  productId: string;
  name?: string;
  price?: number;
  rating?: number;
  stockQuantity?: number;
  description?: string;
  gender?: string;
  sizes?: {
    size: string;
    stockQuantity: number;
  }[];
  imageUrl?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface Sale {
  saleId: string;
  date: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  saleItems: SaleItem[];
}

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "MOBILE_PAYMENT";

export interface CreateSaleRequest {
  items: {
    productId: string;
    size: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: [
    "DashboardMetrics",
    "Products",
    "Users",
    "Expenses",
    "Branches",
    "Sales",
  ],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    createSale: build.mutation<Sale, CreateSaleRequest>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"], // Invalidamos los productos para actualizar el stock
    }),
    getSales: build.query<Sale[], void>({
      query: () => "/sales",
      providesTags: ["Sales"],
    }),
    getProducts: build.query<
      { products: Product[]; totalPages: number; currentPage: number },
      { search?: string; page?: number; limit?: number; branchId?: string }
    >({
      query: ({ search = "", page = 1, limit = 16, branchId }) => ({
        url: "/products",
        params: { search, page, limit, branchId },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(
                ({ productId }) =>
                  ({ type: "Products", id: productId } as const)
              ),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: build.mutation<Product, UpdateProduct>({
      query: ({ productId, ...patch }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Products", id: productId },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProduct: build.mutation<{ success: boolean; id: string }, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getBranches: build.query<Branch[], void>({
      query: () => "/branches",
      providesTags: ["Branches"],
    }),
    getBranchById: build.query<Branch, string>({
      query: (id) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: "Branches", id }],
    }),
    createBranch: build.mutation<Branch, Partial<Branch>>({
      query: (body) => ({
        url: "/branches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Branches"],
    }),
    updateBranch: build.mutation<
      Branch,
      Partial<Branch> & Pick<Branch, "branchId">
    >({
      query: ({ branchId, ...patch }) => ({
        url: `/branches/${branchId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { branchId }) => [
        { type: "Branches", id: branchId },
      ],
    }),
    deleteBranch: build.mutation<{ success: boolean; id: string }, string>({
      query: (branchId) => ({
        url: `/branches/${branchId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Branches", id }],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useCreateSaleMutation,
  useGetSalesQuery,
} = api;
