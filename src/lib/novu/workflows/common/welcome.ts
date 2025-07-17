import { workflow } from '@novu/framework';

export const welcome = workflow('activity.welcome', async ({ step }) => {

  await step.delay('delay', () => {
    return {
      amount: 1,
      unit: 'days'
    }
  });

  await step.inApp('welcome', async () => {
    return {
      subject: 'Welcome to the Holochain',
      body: `We just wanted to take a moment and say thank you for joining the Unnamed Market. If you have ideas about how we can improve your experience, ping us in Discord!`
    }
  });
}, {
  name: 'Welcome',
  description: 'Workflow to welcome new users to the Unnamed Market.',
  tags: ['activity', 'onboarding'],
})