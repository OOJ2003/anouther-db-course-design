import db from "@utils/db"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"


async function DeleteUser(req:NextApiRequest, res:NextApiResponse) {
  if (req.method?.toLowerCase() != "post") {
    res.status(httpCode.FORBIDDEN).end()
    return
  }
  await db.user.delete({
    where: {
      id: Number(req.body.id),
    },
  })
  res.status(httpCode.OK).end()
}

export default DeleteUser