const { z } = require('zod');

const authSchema = z.object({
  merchid: z.string().min(1),
  account: z.string().min(1),
  expiry: z.string().regex(/^\d{4}$/).optional(),
  amount: z.string().regex(/^\d+$/),
  currency: z.string().length(3).default('USD'),
  capture: z.enum(['Y', 'N', 'y', 'n']).default('Y'),
  name: z.string().optional(),
  accttype: z.enum(['ECHK', 'ESAV']).optional(),
  achDescription: z.string().optional(),
  achEntryCode: z.string().optional(),
});

const captureSchema = z.object({
  merchid: z.string().min(1),
  retref: z.string().min(1),
  amount: z.string().regex(/^\d+$/).optional(),
});

const retrefSchema = z.object({
  merchid: z.string().min(1),
  retref: z.string().min(1),
  amount: z.string().regex(/^\d+$/).optional(),
});

const tokenizeSchema = z.object({
  account: z.string().min(1),
  expiry: z.string().regex(/^\d{4}$/).optional(),
  cvv: z.string().optional(),
});

module.exports = {
  authSchema,
  captureSchema,
  retrefSchema,
  tokenizeSchema,
};
