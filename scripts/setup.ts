import { Tigris } from '@tigrisdata/core';
import { loadEnvConfig } from '@next/env';

import { User } from "../models/tigris/users";
import { Order } from "../models/tigris/orders";
import { Product } from "../models/tigris/products";

// Run the config loader only when not executing within next runtime
if (process.env.NODE_ENV === undefined) {
  if (process.env.APP_ENV === 'development') {
    loadEnvConfig(process.cwd(), true);
  } else if (process.env.APP_ENV === 'production') {
    loadEnvConfig(process.cwd());
  }
}

async function main() {
  // setup client and register schemas
  const tigrisClient = new Tigris({serverUrl: "api.dev.tigrisdata.cloud", projectName: "test_nextjs", branch: process.env.BRANCH});
  await tigrisClient.registerSchemas([
    User,
    Order,
    Product,
  ]);
}

main().then(() => {
  console.log("Setup complete")
});
