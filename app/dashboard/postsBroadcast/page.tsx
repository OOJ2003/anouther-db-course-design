"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"

import Table, { ColumnsType } from "antd/es/table"
import { Rate } from "antd"

type PostsBroadcastItem = {
  postsId: number

  isbn: string
  name: string
  author: string
  description: string

  userId: number
  rate: number
  comment: string
}

const getAllPostsBroadcast: () => Promise<PostsBroadcastItem[]> = async () => {
  const res = await fetch("/api/posts")
  const data: any[] = (await res.json()).data
  return data.map((i) => {
    return {
      postsId: i.id,

      isbn: i.book.isbn,
      name: i.book.name,
      author: i.book.author,
      description: i.book.description,

      userId: i.userId,
      rate: i.rate,
      comment: i.content,
    }
  })
}

function PostsBroadcastPage() {
  const [postsBroadcast, setPostsBroadcast] = useState<PostsBroadcastItem[]>([])

  useEffect(() => {
    getAllPostsBroadcast().then((data) => {
      setPostsBroadcast(data)
    })
  }, [])

  const columns: ColumnsType<PostsBroadcastItem> = [
    {
      title: "编号",
      dataIndex: "postsId",
      key: "postsId",
    },
    {
      title: "书籍",
      dataIndex: "isbn",
      key: "isbn",
      render: (isbn, record) => {
        return (
          <div>
            <p>书名: {record.name}</p>
            <p>作者: {record.author}</p>
            <p>简介: {record.description}</p>
            <p>ISBN: {isbn}</p>
          </div>
        )
      },
    },
    {
      title: "读者评价",
      dataIndex: "userId",
      key: "userId",
      render: (_userId, record) => {
        return (
          <div>
            <Rate value={record.rate} />
            <h4>评论: {record.comment}</h4>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={postsBroadcast}
        rowKey="postsId"
      />
    </div>
  )
}

export default PostsBroadcastPage
