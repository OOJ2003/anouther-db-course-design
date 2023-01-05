import db from "@utils/db"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import { Post } from "@prisma/client"
import { addBookToBookLib } from "@model/book.server"
import { borrowBook } from "@model/borrow.server"

export default main

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
      await put(req, res)
      break
    default:
      res.setHeader("Allow", ["post", "get", "put", "delete"])
      res
        .status(httpCode.METHOD_NOT_ALLOWED)
        .end(`Method ${method} Not Allowed`)
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const inventories = await db.book.findMany({
    select: {
      name: true,
      inventory: true,
      lib: true
    }
  }
  )
  res.status(httpCode.OK).json({ data: inventories })
}

async function del(req: NextApiRequest, res: NextApiResponse) {
    
    const id = Number(req.body.id)
    await db.bookLib.delete({
      where: {
        id,
      }
    })
    res.status(httpCode.OK).end()
}
  
async function post(req: NextApiRequest, res: NextApiResponse) {
  const { isbn, location} = req.body 
  try {
    await addBookToBookLib(isbn, location)
  } catch (error) {
    console.log(error)
    res.status(httpCode.INTERNAL_SERVER_ERROR).end()
    return
  }
  res.status(httpCode.OK).end()
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  const { userId, bookId } = req.body
  
  try {
    await borrowBook(Number(userId), bookId)
  } catch (e) {
    console.log(e)
    res.status(httpCode.INTERNAL_SERVER_ERROR).end()
    return
  }

  res.status(httpCode.OK).end()
}