import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from  'astro:schema';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      message: z.string(),
    }),
    handler: async ({ email, message }) => {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["joelgauchia@gmail.com"],
        subject: "A new portfolio inquire from: " + email,
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