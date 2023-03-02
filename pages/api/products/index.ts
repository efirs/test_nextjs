import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../models/tigris/products';
import tigris from '../../../lib/tigris';
import {FindQueryOptions} from "@tigrisdata/core";

type Response = {
  result?: Array<Product>;
  error?: string;
};

// GET /api/products -- gets documents from collection
// POST /api/products { Product } -- inserts a new document to the collection
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const coll = tigris.getCollection<Product>("products");

    const options = new FindQueryOptions()
    if (req.query["limit"]) {
      options.limit = +req.query["limit"]
    }

    if (req.query["offset"]) {
      options.offset = req.query["offset"] as string
    }

    const cursor = coll.findMany({options: options});
    const docs = await cursor.toArray();
    console.log(docs)
    res.status(200).json({ result: docs });
  } catch (err) {
    const error = err as Error;
    console.log("error: " + error.message)
    res.status(500).json({ error: error.message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const doc = req.body as Product;
    const coll = tigris.getCollection<Product>("products");
    console.log(doc)
    const inserted = await coll.insertOne(doc);
    console.log(doc)
    res.status(200).json({ result: [inserted] });
  } catch (err) {
    const error = err as Error;
    console.log("error: " + error.message)
    res.status(500).json({ error: error.message });
  }
}
