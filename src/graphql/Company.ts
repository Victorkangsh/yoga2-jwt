import { prismaObjectType } from 'yoga'

export const Company = prismaObjectType({
  name: 'Company',
  definition(t) {
    // If you wish you customize/hide fields, call `t.prismaFields(['id', ...])`  with the desired field names
    // If you wish to add custom fields on top of prisma's ones, use t.field/string/int...
    t.prismaFields(['*'])
  },
})
