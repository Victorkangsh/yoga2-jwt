import { prismaObjectType, stringArg } from 'yoga'
import { Context } from '../context'
import { getUserId } from '../utils'

export const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    // All fields from the underlying object type are exposed automatically
    // use `t.primaFields(['fieldName', ...])` to hide, customize, or select specific fields

    // This removes all fields from the underlying Query object type
    t.prismaFields([])

    t.list.field('feed', {
      type: 'Post',
      args: {
        after: stringArg({ nullable: true }),
      },
      resolve: (parent, args, ctx: Context) => {
        return ctx.prisma.posts({
          where: { published: true },
          orderBy: 'createdAt_DESC',
          first: 10,
          after: args.after,
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
        after: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString, after }, ctx) => {
        return ctx.prisma.posts({
          where: {
            OR: [
              { title_contains: searchString },
              { content_contains: searchString },
            ],
          },
          orderBy: 'createdAt_DESC',
          first: 10,
          after: after,
        })
      },
    })

    t.field('me', {
      type: 'User',
      resolve: (_, args, ctx: Context) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user({ id: userId })
      },
    })

    t.field('findPost', {
      type: 'Post',
      args: {
        postId: stringArg(),
      },
      resolve: (_, args, ctx: Context) => {
        return ctx.prisma.post({ id: args.postId })
      },
    })
  },
})
