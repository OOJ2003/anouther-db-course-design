import bcrypt from "bcryptjs"
import db from "../utils/db"
import invariant from "tiny-invariant"

export async function postPost(
  content: string,
  rate: number,

  isbn: string,
  userId: number
) {
  return db.post.create({
    data: {
      content,
      rate,
      isbn,
      userId,
    },
  })
}

export async function deletePost(id: number) {
  return db.post.delete({
    where: {
      id: id,
    },
  })
}

export async function updatePost(id: number, content: string, rate: number) {
  return db.post.update({
    where: { id },
    data: {
      content,
      rate,
    },
  })
}
