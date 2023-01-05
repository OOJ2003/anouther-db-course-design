import bcrypt from "bcryptjs"
import db from "../utils/db"

export async function createUser(
  username: string,
  password: string,
  email: string
) {
  const user = await db.user.create({
    data: {
      username: username,
      hash: await bcrypt.hash(password, 10),
      type: "normal",
      email: email,
    },
  })

  await db.credit.create({
    data: {
      userId: user.id,
    },
  })

  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      credit: {
        connect: {
          userId: user.id,
        },
      },
    },
  })
}

export async function updateUserType(id: number, type: "admin" | "normal") {
  return db.user.update({
    where: {
      id: id,
    },
    data: {
      type,
    },
  })
}

export async function updateUserInfo(
  id: number,
  password: string,
  sex: string
) {
  return db.user.update({
    where: {
      id: id,
    },
    data: {
      hash: await bcrypt.hash(password, 10),
      sex: sex,
    },
  })
}

export async function deleteUser(id: number) {
  return db.user.delete({
    where: {
      id,
    },
  })
}

export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      type: true,
      sex: true,
    },
  })
}

export async function getUsersByName(name: string) {
  return db.user.findMany({
    where: {
      username: {
        contains: name,
      },
    }, select: {
      id: true,
      username: true,
      email: true,
      type: true,
      sex: true
    }
  })
}

export async function getUserById(id: number) {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      type: true,
      sex: true,
    },
  })
}
