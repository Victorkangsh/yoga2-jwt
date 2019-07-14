import { prisma, Prisma } from '../.yoga/prisma-client'
import { yogaContext } from 'yoga'

export interface Context {
  req: any
  db: Prisma
}

export default yogaContext(({ req }) => ({
  req,
  db: prisma,
}))
