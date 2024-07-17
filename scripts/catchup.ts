import { did, getAgent } from "src/agent.js";
import { assign } from "src/assign.js";

const agent = await getAgent();

const likes = [];
let cursor;

while (true) {
  const { data } = await agent.api.app.bsky.feed.getLikes({
    uri: `at://${did}/app.bsky.labeler.service/self`,
    limit: 100,
    cursor,
  });
  likes.push(...data.likes);
  cursor = data.cursor;
  if (!cursor) break;
}

for (const like of likes) {
  await assign(like.actor).catch((err) => console.error(err.message));
}
