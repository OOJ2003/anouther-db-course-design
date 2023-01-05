import db from "@utils/db"
import * as ps from "@model/post.server"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import { Post } from "@prisma/client"
import { returnBook } from "@model/borrow.server"


async function main(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  console.log(req.body)

  switch (method?.toLowerCase()) {
    case "post":
      //await post(req, res)
      break
    case "get":
      // await get(req, res)
      break
    case "delete":
      // await del(req, res)
      break
    case "put":
      await put(req, res)
      break
    case "patch":
      await patch(req, res)
      break
    default:
      res.setHeader("Allow", ["post", "get", "put", "delete"])
      res
        .status(httpCode.METHOD_NOT_ALLOWED)
        .end(`Method ${method} Not Allowed`)
  }
}

export default main

async function patch(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body 
  const borrows = await db.user.findUnique({
    where: {
      id: Number(data.userId),
    },
    select: {
      borrows: true
    }
  })
  res.status(httpCode.OK).json({ data: borrows })
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  const data: { bookID: number } = req.body
  try {
    await returnBook(data.bookID)
  } catch (e) {
    console.error(e)
    res.status(httpCode.BAD_REQUEST).end()
    return
  }
  res.status(httpCode.OK).end()
}