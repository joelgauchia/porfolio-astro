import { ActionError, defineAction } from 'astro:actions';
import { getSecret } from 'astro:env/server';
import { Resend } from 'resend';
import { z } from  'astro:schema';

export const server = {
  send: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      message: z.string().min(1).max(5000),
    }),
    handler: async ({ email, message }) => {
      // Read the key at request time. import.meta.env would inline the secret
      // into the build output, and the eager `astro:env/server` export would
      // fail the whole page render when the variable is missing — getSecret
      // keeps the failure contained to this action.
      const apiKey = getSecret('RESEND_API_KEY');

      if (!apiKey) {
        throw new ActionError({
          code: 'SERVICE_UNAVAILABLE',
          message: 'Email delivery is not configured.',
        });
      }

      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["joelgauchia@gmail.com"],
        replyTo: email,
        subject: "A new portfolio inquiry from: " + email,
        text: message
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }
      return data;
    },
  }),
};
