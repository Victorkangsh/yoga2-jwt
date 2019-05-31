import { prisma } from '../.yoga/prisma-client'

async function main() {
  await prisma.createUser({
    email: 'kwc@1wire.com',
    name: 'victor',
    phone: '111111111',
    role: 'ADMIN',
    secret: 'it should be bcrypted password',
  })
}

main().catch(e => console.error(e))
