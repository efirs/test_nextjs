import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/tigris/users';
import { SearchQuery } from '@tigrisdata/core';
import tigris from '../../../lib/tigris';

type Data = {
  result?: Array<User>;
  error?: string;
};

// GET /api/users/search?q=searchQ -- searches for items matching text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query['q'];
  if (query === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const coll = tigris.getCollection<User>("users");
    const searchRequest: SearchQuery<User> = { q: query as string };
    const searchResult = await coll.search(searchRequest);
    const docs = new Array<User>();
    for await (const result of searchResult.stream()) {
      docs.push(result);
    }
    res.status(200).json({ result: docs });
  } catch (err) {
    const error = err as Error;
    console.log('search: ' + error.message)
    res.status(500).json({ error: error.message });
  }
}
