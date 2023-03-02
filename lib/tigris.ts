import { DB, Tigris } from '@tigrisdata/core';

declare global {
  // eslint-disable-next-line no-var
  var tigris: DB;
}

// Caching the client because `next dev` would otherwise create a
// new connection on every file save while previous connection is active due to
// hot reloading. However, in production, Next.js would completely tear down before
// restarting, thus, disconnecting and reconnecting to the Tigris.
if (!global.tigris) {
  let branch = "main"
  if (process.env.BRANCH) {
    branch =process.env.BRANCH
  }

  const tigrisClient = new Tigris({serverUrl: "localhost:8081", projectName: "test_nextjs", branch: branch});
  global.tigris = tigrisClient.getDatabase();
}
const tigris = global.tigris;

// export to share DB across modules
export default tigris;
