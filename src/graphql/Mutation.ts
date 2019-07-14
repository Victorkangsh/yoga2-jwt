import { idArg, prismaObjectType, stringArg } from 'yoga'
import { Context } from '../context'
import { getUserId } from '../utils'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    // All fields from the underlying object type are exposed automatically
    // use `t.primaFields(['fieldName', ...])` to hide, customize, or select specific fields

    // This removes all fields from the underlying Mutation object type
    t.prismaFields([])

    t.field('signupUser', {
      type: 'AuthPayload',
      args: {
        phone: stringArg(),
        secret: stringArg(),
        name: stringArg(),
      },
      resolve: async (parent, args, ctx: Context) => {
        const secret = await bcrypt.hash(args.secret, 10)
        const user = await ctx.db.createUser({
          phone: args.phone,
          name: args.name,
          secret,
        })

        const token = jwt.sign({ userId: user.id }, process.env
          .PRISMA_APP_SECRET as jwt.Secret)

        return {
          token,
          user,
        }
      },
    })

    t.field('signin', {
      type: 'AuthPayload',
      args: {
        phone: stringArg(),
        secret: stringArg(),
      },
      resolve: async (parent, { phone, secret }, ctx: Context) => {
        const user = await ctx.db.user({ phone })
        const valid = await bcrypt.compare(secret, user ? user.secret : '')

        if (!valid || !user) {
          throw new Error('Invalid Credentials')
        }

        const token = jwt.sign({ userId: user.id }, process.env
          .PRISMA_APP_SECRET as jwt.Secret)

        return {
          token,
          user,
        }
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: {
        id: idArg(),
      },
      resolve: async (parent, args, ctx: Context) => {
        const userId = getUserId(ctx)
        const author = await ctx.db.post({ id: args.id }).author()
        if (author.id !== userId) {
          throw new Error('错误')
        }
        return ctx.db.deletePost({ id: args.id })
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg(),
        description: stringArg(),
        type: stringArg({ nullable: true }),
        raw: stringArg(),
        cover: stringArg(),
      },
      resolve: (parent, args, ctx: Context) => {
        const userId = getUserId(ctx)

        return ctx.db.createPost({
          ...args,
          author: { connect: { id: userId } },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        id: idArg(),
      },
      resolve: (parent, { id }, ctx: Context) => {
        return ctx.db.updatePost({
          where: { id },
          data: { published: true },
        })
      },
    })
  },
})
