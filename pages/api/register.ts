import { Route } from "next/dist/server/router"
import { NextApiRequest, NextApiResponse } from "next"
import { createUser } from "@model/user.server"

export default async function Register(req: NextApiRequest, res: NextApiResponse) {
  const data: {username: string, password: string, email: string} = req.body
  createUser(data.username, data.password, data.email)
}