import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.$use(async (params, next) => {
  if (params.model == 'Book' || params.model == 'Bookmark') {
    if (params.action == 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action == 'findMany') {
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          params.args.where['deleted'] = false
        }
      } else {
        params.args['where'] = { deleted: false }
      }
    }
  }
  return next(params)
})
export default prisma
