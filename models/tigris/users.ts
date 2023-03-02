import { Field, PrimaryKey, TigrisCollection, TigrisDataTypes } from "@tigrisdata/core";

// Street address of the user
export class Address {
  // Name of the city
  @Field()
  city: string;

  // Name of the state
  @Field()
  state: string;

  // Street number
  @Field()
  street: string;

  // The zip code
  @Field(TigrisDataTypes.INT64)
  zip: string;
}

// Collection of documents with details of users
@TigrisCollection("users")
export class User {
  // Street address of the user
  @Field()
  address: Address;

  // User account balance
  @Field()
  balance: number;

  // A unique identifier for the user
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: string;

  // Languages spoken by the user
  @Field({ elements: TigrisDataTypes.STRING })
  languages: Array<string>;

  // Name of the user
  @Field({ maxLength: 100 })
  name: string;
}
