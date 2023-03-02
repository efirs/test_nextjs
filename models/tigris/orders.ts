import { Field, PrimaryKey, TigrisCollection, TigrisDataTypes } from "@tigrisdata/core";

export class ProductItem {
  // The product identifier
  @Field(TigrisDataTypes.INT64)
  id: string;

  // The quantity of this product in this order
  @Field(TigrisDataTypes.INT64)
  quantity: string;
}

// Collection of documents with details of an order
@TigrisCollection("orders")
export class Order {
  // A unique identifier for the order
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: string;

  // The total cost of the order
  @Field()
  order_total: number;

  // The list of products that are part of this order
  @Field({ elements: ProductItem })
  productItems: Array<ProductItem>;

  // The identifier of the user that placed the order
  @Field(TigrisDataTypes.INT64)
  user_id: string;
}
