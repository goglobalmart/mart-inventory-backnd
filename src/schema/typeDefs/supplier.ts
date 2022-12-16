import { gql } from "apollo-server-express";

const supplier = gql`
scalar DataTime
type Supplier {
  _id: ID
  name: String
  tel: String
  email: String
  adress: String
  remark: String
  facebook: String
  image_Src: String
  image_Name: String
  created_At: DataTime
}
type supplierMessage {
  message: String
  status: Boolean
}
type getSupplierMessage {
  message: String
  status: Boolean
  data: [ Supplier ]
}
# Input Type
input createSupplierInput {
  name: String
  tel: String
  email: String
  adress: String
  remark: String
  facebook: String
  image_Src: String
  image_Name: String
}
type SupplierPaginator {
  data: [Supplier]
  paginator: Paginator
}
type Paginator {
  slNo: Int
  prev: Int
  next: Int
  perPage: Int
  totalPosts: Int
  totalPages: Int
  currentPage: Int
  hasPrevPage: Boolean
  hasNextPage: Boolean
  totalDocs: Int
}
type Query {
  getSuppliers( keyword: String! ):  getSupplierMessage! 
  getSuppliersWithPagination(
    page: Int
    limit: Int
    keyword: String
    pagination: Boolean
    ): SupplierPaginator
} 
type Mutation {
  createdSupplier(input: createSupplierInput!): supplierMessage!
  updateSupplier(supplerId: ID,input: createSupplierInput!): supplierMessage!
  deleteSupplier(supplerId: ID): supplierMessage!
}
`;

export default supplier;