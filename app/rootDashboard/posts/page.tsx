"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"
import { Post, Book } from "@prisma/client"
import Table, { ColumnsType } from "antd/es/table"
import { message } from "antd"

type Comment = {
  id: number
  content: string
  rate: number
  bookName: string
  userId: number
}

function CommentPage() {
  const [comments, setComments] = useState<Comment[]>([])

  const columns: ColumnsType<Comment> = [
    {
      title: "编号",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "书名",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "评分",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "用户ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "操作",
      key: "action",
      render: (_, i) => (
        <div>
          <a
            onClick={() => {
              fetch(`/api/posts`, {
                method: "DELETE",
                body: JSON.stringify({
                  id: i.id,
                }),
              })
                .then(() => {
                  setComments(comments.filter((j) => j.id !== i.id))
                  message.success("删除成功")
                })
                .catch(() => {
                  message.error("删除失败")
                })
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ]

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(
        (i: {
          data: (Post & {
            book: Book
          })[]
        }) => {
          const data: Comment[] = i.data
            .filter((i) => !i.delete)
            .map((i) => {
              return {
                id: i.id,
                content: i.content,
                rate: i.rate,
                bookName: i.book.name,
                userId: i.userId,
              }
            })
          setComments(data)
        }
      )
  }, [])

  return (
    <div>
      <Table columns={columns} dataSource={comments} rowKey="id" />
    </div>
  )
}

export default CommentPage
