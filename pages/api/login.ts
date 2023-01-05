import { Route } from "next/dist/server/router"
import { NextApiRequest, NextApiResponse } from "next"

import { StatusCodes as httpCode } from "http-status-codes"
import invariant from "tiny-invariant"

import bcrypt from "bcryptjs"
import * as usr from "@model/user.server"
import db from "@utils/db"
import * as state from "@utils/state.server"

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body)
  const body: { id: number, password: string } = req.body
  const data = await db.user.findUnique({
    where: {
      id: body.id
    },
    select: {
      hash: true,
      type: true,
      username: true,
    },
  })
  invariant(data, () => {
    res.status(httpCode.NOT_FOUND).end()
    return "server side: User not found"
  })

  const match = await bcrypt.compare(body.password, data.hash)
  if (!match) {
    res.status(httpCode.FORBIDDEN).end()
    return
  }
  
  state.login.set(true)
  state.loginType.set(data.type as any)
  

  res.status(httpCode.OK).json({id: body.id, type: data.type, username: data.username})

}