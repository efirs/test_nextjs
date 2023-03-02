import { Field, PrimaryKey, TigrisCollection, TigrisDataTypes } from "@tigrisdata/core";

// Collection of documents with details of products available
@TigrisCollection("products")
export class Product {
  // A unique identifier for the product
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: string;

  // Name of the product
  @Field({ maxLength: 100 })
  name: string;

  // Price of the product
  @Field()
  price: number;

  // Number of products available in the store
  @Field(TigrisDataTypes.INT64)
  quantity: string;
}
