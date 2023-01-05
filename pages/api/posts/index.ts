import db from "@utils/db"
import * as ps from "@model/post.server"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import { Post } from "@prisma/client"



async function main(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method?.toLowerCase()) {
    case "post":
      await post(req, res)
      break
    case "get":
      await get(req, res)
      break
    case "delete":
      await del(req, res)
      break
    case "put":
      //await put(req, res)
      break
    default:
      res.setHeader("Allow", ["post", "get", "put", "delete"])
      res
        .status(httpCode.METHOD_NOT_ALLOWED)
        .end(`Method ${method} Not Allowed`)
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const posts = await db.post.findMany({
    include: {
      book: true,
    },
  })
  res.status(httpCode.OK).json({ data: posts })
}

async function del(req: NextApiRequest, res: NextApiResponse) {
  
  const id = Number(req.body.id)
  await db.post.update({
    where: {
      id,
    },
    data: {
      delete: true,
    },
  })
  res.status(httpCode.OK).end()
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { content, rate, isbn, userId } = req.body
  await ps.postPost(content, Number(rate), isbn, Number(userId))
  res.status(httpCode.OK).end()
}

export default main