import { did, getAgent } from "./agent.js";
import { AppBskyActorDefs } from "@atproto/api";

const values = [
  "AST", "BRD", "BLM", "DNC", "DRK", "DRG", "GNB", "MCH", "MNK", "NIN", "PLD", "RDM", "SAM", "SCH", "SMN", "WAR", "WHM", "PCT", "VPR"
]

export const assign = async (subject: string | AppBskyActorDefs.ProfileView, job?: string) => {
  if (typeof subject === "string") {
    const agent = await getAgent();
    const { data } = await agent.getProfile({ actor: subject });
    if (!data) throw new Error("Profile not found");
    subject = data;
  }
  const agent = await getAgent();
  if (!job) {
    job = values[Math.floor(Math.random() * values.length)];
  } else if (!values.includes(job)) {
    throw new Error("Invalid job");
  }

  console.log(`@${subject.handle} is ${job}`);
  await agent
    .withProxy("atproto_labeler", did)
    .api.tools.ozone.moderation.emitEvent({
      event: {
        $type: "tools.ozone.moderation.defs#modEventLabel",
        createLabelVals: [job],
        negateLabelVals: [],
      },
      subject: {
        $type: "com.atproto.admin.defs#repoRef",
        did: subject,
        },
      createdBy: agent.session!.did,
      createdAt: new Date().toISOString(),
      subjectBlobCids: [],
    });
  };

