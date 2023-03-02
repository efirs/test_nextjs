import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/tigris/users';
import tigris from '../../../lib/tigris';

type Data = {
  result?: User;
  error?: string;
};

// GET /api/user/[id] -- gets document from collection where id = [id]
// PUT /api/user/[id] { User } -- updates the document in collection where id = [id]
// DELETE /api/user/[id] -- deletes the document in collection where id = [id]
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'PUT':
      await handlePut(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const coll = tigris.getCollection<User>("users");
    const doc = await coll.findOne({ filter: {
      id: req.query.id as User["id"]
    }});
    if (!doc) {
      res.status(404).json({ error: 'Not found' });
    } else {
      console.log('get: ' + req.query)
      res.status(200).json({ result: doc });
    }
  } catch (err) {
    const error = err as Error;
    console.log("error: " + error.message)
    res.status(500).json({ error: error.message });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const doc = req.body as User;
    const coll = tigris.getCollection<User>("users");
    const updated = await coll.insertOrReplaceOne(doc);
    console.log('updated: ' + doc)
    res.status(200).json({ result: updated });
  } catch (err) {
    const error = err as Error;
    console.log("error: " + error.message)
    res.status(500).json({ error: error.message });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const coll = tigris.getCollection<User>("users");
    const status = (await coll.deleteOne({ filter: {
      id: req.query.id as User["id"]
    }})).status;
    if (status === 'deleted') {
      console.log('deleted:' + req.query)
      res.status(200).json({});
    } else {
      res.status(500).json({ error: `Failed to delete ${req.query.id}` });
    }
  } catch (err) {
    const error = err as Error;
    console.log("error: " + error.message)
    res.status(500).json({ error: error.message });
  }
}
