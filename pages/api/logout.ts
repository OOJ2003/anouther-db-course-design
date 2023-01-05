import { NextApiRequest, NextApiResponse } from "next";

import { StatusCodes as httpCode } from "http-status-codes";

import * as state from "@utils/state.server";

export default async function Logout(req: NextApiRequest, res: NextApiResponse) {
  state.login.set(false);
  state.loginType.set(null);
  state.username.set(null);

  res.status(httpCode.OK).end();
}