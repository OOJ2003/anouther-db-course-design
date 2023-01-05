import * as usr from "@model/user.server"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"

export default async function User(req: NextApiRequest, res: NextApiResponse) {
  let {
    query: { id },
    method,
  } = req

  if (id === undefined || id === null) {
    res.status(httpCode.FORBIDDEN).end()
    return
  }

  if (method?.toLowerCase() != "get") {
    res.status(httpCode.NOT_IMPLEMENTED).end()
    return
  }

  if (typeof id !== "string") {
    id = id[0]
  }

  const users = await usr.getUserById(Number(id))

  res.status(httpCode.OK).json({ data: users })
}
