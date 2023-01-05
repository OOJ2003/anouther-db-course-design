import bcrypt from "bcryptjs"
import db from "../utils/db"
import invariant from "tiny-invariant"

export async function borrowBook(userId: number, bookId: number) {
  const credit = await db.credit.findUnique({
    where: {
      userId
    }
  })

  invariant(credit != null && credit.credit > 0, "信用过低！")

  const book = await db.bookLib.findUnique({
    where: {
      id: bookId,
    },
  })
  invariant(book, "图书不存在！")

  const bookLib = await db.bookLib.findUnique({
    where: {
      id: bookId,
    },
  })
  invariant(bookLib, "图书不存在！")

  if (!bookLib.status) {
    invariant(false, "图书已经借出！")
  }

  await db.bookLib.update({
    where: {
      id: bookId,
    },
    data: {
      status: false,
    },
  })

  const returnDate = new Date()
  returnDate.setDate(returnDate.getDate() + 30)

  await db.inventory.update({
    where: {
      isbn: book.isbn,
    },
    data: {
      rest: {
        decrement: 1,
      },
    },
  })

  return db.borrow.create({
    data: {
      returnDate,
      user: {
        connect: {
          id: userId,
        },
      },
      book: {
        connect: {
          isbn: book.isbn,
        },
      },

      bookLib: {
        connect: {
          id: bookId,
        },
      },
    },
  })

  // return prisma.borrow.update({
  //   where: {
  //     id: temp.id
  //   },
  //   data: {
  //     user: {
  //       connect: {
  //         id: temp.userId,
  //       }
  //     },
  //     book: {
  //       connect: {
  //         isbn: temp.isbn
  //       }
  //     },
  //     bookLib: {
  //       connect: {
  //         id: temp.bookId
  //       }
  //     }
  //   }
  // })
}

export async function returnBook(bookId: number) {
  const borrow = (await db.borrow.findMany({
    where: {
      bookId,
    },
  }))![0]
  invariant(borrow, "图书不存在！")

  const now = new Date()
  if (now > borrow.returnDate) {
    db.credit.update({
      where: {
        userId: borrow.userId,
      },
      data: {
        credit: {
          decrement: 1,
        },
      },
    })
  }

  await db.inventory.update({
    where: {
      isbn: borrow.isbn,
    },
    data: {
      rest: {
        increment: 1,
      },
    },
  })

  await db.bookLib.updateMany({
    where: {
      id: bookId,
    },
    data: {
      status: true,
    },
  })

  return db.borrow.updateMany({
    where: {
      bookId,
    },
    data: {
      isReturn: true,
    },
  })
}
