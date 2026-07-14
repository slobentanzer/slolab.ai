import { z } from 'zod'

export const teamMemberLinkSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().url(),
})

export const teamMemberSchema = z.object({
  index: z.number().int().nonnegative(),
  alumni: z.boolean(),
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  focus: z.string().trim().min(1),
  expertise: z.array(z.string().trim().min(1)).min(1).optional(),
  values: z.array(z.string().trim().min(1)).min(1).optional(),
  currentWork: z.array(z.string().trim().min(1)).min(1).optional(),
  links: z.array(teamMemberLinkSchema).min(1).optional(),
  image: z.string().trim().startsWith('/images/'),
})

export type TeamMemberLink = z.infer<typeof teamMemberLinkSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
