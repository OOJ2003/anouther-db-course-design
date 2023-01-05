import db from "@utils/db"
import { StatusCodes as httpCode } from "http-status-codes"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"

type UpdateProps = {
  id: number
  username?: string
  email?: string
  sex?: string
  type?: "admin" | "normal"
  password?: string
}

async function UpdateUser(req:NextApiRequest, res:NextApiResponse) {
  const props: UpdateProps = req.body
  if (req.method?.toLowerCase() != "put") {
    res.status(httpCode.METHOD_NOT_ALLOWED).end()
    return
  }

  console.log(props)
  try {
    await db.user.update({
      where: {
        id: Number(props.id),
      },
      data: {
        username: props.username,
        email: props.email,
        sex: props.sex,
        type: props.type,
        hash: props.password ? await bcrypt.hash(props.password, 10) : undefined,
      },
    })
  } catch (e) { 
    console.log(e)
    res.status(httpCode.INTERNAL_SERVER_ERROR).end()
    return
  }
  res.status(httpCode.OK).end()
}

export default UpdateUser