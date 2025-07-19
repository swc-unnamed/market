import { workflow } from "@novu/framework";
import { z } from "zod";

export const activityFeed = workflow('activity.feed', async ({ step, payload }) => {

  await step.inApp('feed', async () => {
    return {
      subject: payload.subject,
      body: payload.body,
      redirect: {
        url: payload.redirect,
      }
    }
  })
},
  {
    name: 'Activity Feed',
    description: 'Activity feed for general updates around the application.',
    tags: ['activity'],
    payloadSchema: z.object({
      subject: z.string(),
      body: z.string(),
      redirect: z.string()
    })
  })