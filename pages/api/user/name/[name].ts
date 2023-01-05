import * as usr from "@model/user.server"
import {StatusCodes as httpCode} from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"

export default async function User(req: NextApiRequest, res: NextApiResponse) {
  let {
    query: { name },
    method,
  } = req

  if (name === undefined || name === null) {
    res.status(httpCode.FORBIDDEN).end()
    return
  }

  if (method?.toLowerCase() != "get") {
    res.status(httpCode.NOT_IMPLEMENTED).end()
    return
  }
  
  if (typeof name !== "string") {
    name = name[0]
  }

  // console.log("name", name)
  const users = await usr.getUsersByName(name)
  res.status(200).json({ data: users })
}
