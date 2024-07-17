import { AppBskyLabelerService, BskyAgent, jsonStringToLex, jsonToLex } from "@atproto/api";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const agent = new BskyAgent({
  service: process.env.BSKY_SERVICE ?? "https://bsky.social",
});

await agent.login({
  identifier: process.env.BSKY_IDENTIFIER!,
  password: process.env.BSKY_PASSWORD!,
});

const configPath = path.resolve(process.env.CONFIG_PATH!);
const configData = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configData);
config.createdAt = new Date().toISOString();
const labelConfig = jsonToLex(config) satisfies AppBskyLabelerService.Record;

await agent.api.app.bsky.labeler.service
  .delete({
    repo: agent.session!.did,
    rkey: "self",
  })
  .catch(() => null);
await agent.api.app.bsky.labeler.service.create(
  {
    repo: agent.session!.did,
    rkey: "self",
  },
  labelConfig,
);

console.log("Done!");
