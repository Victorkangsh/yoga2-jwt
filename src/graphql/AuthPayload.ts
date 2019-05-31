import { objectType } from 'yoga'

export const TripUpdateResponse = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User', nullable: true })
  },
})
