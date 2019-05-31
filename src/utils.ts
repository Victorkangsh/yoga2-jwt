import * as jwt from 'jsonwebtoken'

export function getUserId(context) {
  const Authorization = context.req.headers.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.PRISMA_APP_SECRET!) as {
      userId: string
    }
    return userId
  }

  throw new AuthError()
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}
