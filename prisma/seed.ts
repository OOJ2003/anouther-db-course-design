import { pinyin } from "pinyin-pro"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

enum BookTypes {
  马克思主义 = 1,
  哲学,
  社会科学总论,
  政治法律,
  军事,
  经济,
  文化,
  语言,
  文学,
  艺术,
  历史地理,
  自然科学总论,
  数理科学和化学,
  天文学地球科学,
  生物科学,
  医药卫生,
  农业科学,
  工业技术,
  交通运输,
  航空航天,
  环境科学,
  综合,
}

async function addBookToBookLib(isbn: string, location: string) {
  const temp = await prisma.bookLib.create({
    data: {
      location,
      isbn,
      status: true,
    },
  })
  await prisma.inventory.update({
    where: {
      isbn,
    },
    data: {
      sums: {
        increment: 1,
      },
      rest: {
        increment: 1,
      },
    },
  })
  return prisma.bookLib.update({
    where: {
      id: temp.id,
    },
    data: {
      book: {
        connect: {
          isbn,
        },
      },
    },
  })
}

async function createUser(
  username: string,
  password: string,
  email: string
) {
  const user = await prisma.user.create({
    data: {
      username: username,
      hash: await bcrypt.hash(password, 10),
      type: "normal",
      email: email,
    },
  })

  await prisma.credit.create({
    data: {
      userId: user.id,
    },
  })

  return prisma.user.update({
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

async function createBook(
  isbn: string,
  name: string,
  author: string,
  description: string,
  price: number,
  type: number
) {
  return prisma.book.create({
    data: {
      isbn,
      name,
      author,
      description,
      price,
      type,
      inventory: {
        connectOrCreate: {
          where: {
            isbn,
          },
          create: {},
        },
      },
    },
  })
}

async function updateUserType(id: number, type: "admin" | "normal") {
  return prisma.user.update({
    where: {
      id: id,
    },
    data: {
      type,
    },
  })
}

const wordToPinYin = (word: string) => {
  const temp = pinyin(word, {
    pattern: "pinyin",
    toneType: "none",
    type: "array",
  })
  return temp.join("")
}

async function seed() {
  const bookTypeInit = async () => {
    const allTypes = [
      "马克思主义",
      "哲学",
      "社会科学总论",
      "政治法律",
      "军事",
      "经济",
      "文化",
      "语言",
      "文学",
      "艺术",
      "历史地理",
      "自然科学总论",
      "数理科学和化学",
      "天文学地球科学",
      "生物科学",
      "医药卫生",
      "农业科学",
      "工业技术",
      "交通运输",
      "航空航天",
      "环境科学",
      "综合",
    ]
    for (const t of allTypes) {
      await prisma.bookType.create({
        data: {
          name: t,
        },
      })
    }
  }
  await bookTypeInit()

  //创建用户信息
  const usersInit = async () => {
    const names = ["张一", "张二", "张三", "张四", "张五", "李一", "李二"]
    const allUsers: Array<{ name: string; password: string; email: string }> =
      names.map((i, _j) => {
        return {
          name: i,
          password: "12345",
          email: `${wordToPinYin(i)}@DatabaseCourseDesign.com`,
        }
      })

    for (const i of allUsers) {
      const { name, password, email } = i
      await createUser(name, password, email)
    }
    await createUser("admin", "admin", "admin@dbcd.com")
    const admin = (await prisma.user.findFirst({
      where: {
        username: "admin",
      },
    }))!
    updateUserType(admin.id, "admin")
  }

  await usersInit()

  const booksInit = async () => {
    const books: Array<{
      isbn: string
      name: string
      author: string
      description: string
      price: number
      type: BookTypes
    }> = [
      {
        isbn: "978-7-03-029253-7",
        name: "物联网导论",
        author: "刘云浩",
        description:
          "本书从物联网的感知识别层、网络构建层、管理服务层和综合应用层这4层分别进行阐述",
        price: 45.0,
        type: 13,
      },
      {
        isbn: "978-7-03-061971-6",
        name: "计算机组成原理",
        author: "白中英，戴志涛",
        description:
          "重点讲授计算机单处理器系统的组成和工作原理，在此基础上扩展讲授并行体系",
        price: 68,
        type: 13,
      },
      {
        isbn: "978-7-04-040664-1",
        name: "数据库系统概论",
        author: "王珊，萨师煊",
        description: "本书系统阐述了数据库系统的基础理论、基本技术和基本方法",
        price: 39.6,
        type: 13,
      },
      {
        isbn: "978-7-118-04607-6",
        name: "通信原理",
        author: "樊昌信，曹丽娜",
        description: "作为全国高等学校电子信息类规划教材",
        price: 46,
        type: 13,
      },
      {
        isbn: "978-7-302-37236-3",
        name: "JSP程序设计",
        author: "耿祥义，张跃平",
        description: "本书详细讲解了JSP语法和基本的程序设计方法",
        price: 39.5,
        type: 13,
      },
      {
        isbn: "978-7-80128-290-3",
        name: "古文观止",
        author: "吴楚材，吴调侯（编选）",
        description:
          "选材上起《左转》、《国语》，下止明代刘基、归有光，所选222篇文章皆为千古名作",
        price: 48,
        type: 7,
      },
      {
        isbn: "978702005170",
        name: "红楼梦",
        author: "曹雪芹，高鹗",
        description:
          "一个石头上记载的故事，金玉良缘的命里注定，乾坤里不能扭转的情感寄托，在古奇书中流淌着一个凄艳委婉的情缘。",
        price: 60,
        type: 7,
      },
      {
        isbn: "9787020008735",
        name: "西游记",
        author: "吴承恩",
        description:
          "主要描写的是孙悟空保唐僧西天取经，历经九九八十一难的故事。",
        price: 47.2,
        type: 7,
      },
      {
        isbn: "9787540143015",
        name: "走出巴颜喀拉",
        author: "李伯安",
        description:
          "是中国美术史上最富民族精神、最具震撼力的史诗性水墨人物长卷作品，被公认为中国21世纪艺术的辉煌代表。",
        price: 268,
        type: 10,
      },
    ]
    for (const b of books) {
      const { isbn, name, author, description, price, type } = b
      await createBook(isbn, name, author, description, price, type)
    }
  }

  await booksInit()

  const bookLibsInit = async () => {
    const bookLibItems: Array<{ isbn: string; location: string }> = [
      { isbn: "978-7-03-029253-7", location: "001-001" },
      { isbn: "978-7-03-029253-7", location: "001-002" },
      { isbn: "978-7-03-061971-6", location: "002-001" },
      { isbn: "978-7-03-061971-6", location: "002-002" },
      { isbn: "978-7-03-061971-6", location: "002-003" },
      { isbn: "978-7-04-040664-1", location: "003-001" },
      { isbn: "978-7-04-040664-1", location: "003-002" },
      { isbn: "978-7-04-040664-1", location: "003-003" },
      { isbn: "978-7-118-04607-6", location: "004-001" },
      { isbn: "978-7-118-04607-6", location: "004-002" },
      { isbn: "978-7-118-04607-6", location: "004-003" },
      { isbn: "978-7-118-04607-6", location: "004-004" },
      { isbn: "978-7-302-37236-3", location: "005-001" },
      { isbn: "978-7-302-37236-3", location: "005-002" },
      { isbn: "978-7-80128-290-3", location: "006-001" },
      { isbn: "978-7-80128-290-3", location: "006-002" },
      { isbn: "978-7-80128-290-3", location: "006-003" },
      { isbn: "978-7-80128-290-3", location: "006-004" },
      { isbn: "978-7-80128-290-3", location: "006-005" },
      { isbn: "9787020008735", location: "007-001" },
      { isbn: "9787020008735", location: "007-002" },
      { isbn: "9787020008735", location: "007-003" },
      { isbn: "9787020008735", location: "007-004" },
      { isbn: "9787020008735", location: "007-005" },
      { isbn: "978702005170", location: "008-001" },
      { isbn: "978702005170", location: "008-002" },
      { isbn: "978702005170", location: "008-003" },
      { isbn: "978702005170", location: "008-004" },
      { isbn: "978702005170", location: "008-005" },
      { isbn: "9787540143015", location: "009-001" },
      { isbn: "9787540143015", location: "009-002" },
    ]

    for (const b of bookLibItems) {
      const { isbn, location } = b
      await addBookToBookLib(isbn, location)
    }
  }

  await bookLibsInit()
}

console.log("seeding start...🪴")
seed()
  .then(() => {
    console.log("db seeded successfully, enjoy your database! 🥳")
  })
  .catch((e) => {
    console.log(`opps, something went wrong. 😥\n ${e.toString()}`)
  })
