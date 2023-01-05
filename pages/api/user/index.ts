import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import * as usr from "@model/user.server"

export default async function User(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toLowerCase() !== "get") {
    res.status(400).end()
    return
  } 
  res.status(httpCode.OK).json({ data: await usr.getAllUsers() })
}
