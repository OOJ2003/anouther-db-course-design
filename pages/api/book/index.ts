import db from "@utils/db"
import * as bk from "@model/book.server"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { Book } from "@prisma/client"
import { BookTypes } from "@model/book.server"

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
  const books = (await bk.getBooks())
  res.status(httpCode.OK).json(books)
}

async function del(req: NextApiRequest, res: NextApiResponse) {
  const isbn = req.body.isbn
  await bk.deleteBook(isbn)
  res.status(httpCode.OK).end()
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  const data: {isbn: string, new: Book} = req.body
  // await bk.updateBook(book)
  res.status(httpCode.OK).end()
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const book: Book = req.body
  await bk.createBook(
    book.isbn,
    book.name,
    book.author,
    book.description,
    book.type,
    book.type
  )
  res.status(httpCode.OK).end()
}

export default main
