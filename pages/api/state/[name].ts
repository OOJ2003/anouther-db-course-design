import { NextApiRequest, NextApiResponse } from "next"
import { StatusCodes as httpCode } from "http-status-codes"
import invariant from "tiny-invariant"
import { login, loginType } from "@utils/state.server"

export default async function ServerState(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { name },
    method,
  } = req

  if (
    method === undefined ||
    method.toLowerCase() !== "get" ||
    typeof name !== "string"
  ) {
    res.status(httpCode.FORBIDDEN).end()
    return
  }

  res.setHeader("Content-Type", "application/json")
  switch (name) {
    case "login":
      res.status(httpCode.OK).json({ data: login.get() })
      break
    case "loginType":
      res.status(httpCode.OK).json({ data: loginType.get() })
      break
    default:
      res.status(httpCode.FORBIDDEN).end()
  }
}
