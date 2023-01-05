"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"

import Table, { ColumnsType } from "antd/es/table"
import { Button, Form, message, Modal, Rate, Tag } from "antd"
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components"
import { getEnumArray } from "enum-array"
import TextArea from "antd/es/input/TextArea"

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

type Book = {
  isbn: string
  name: string
  author?: string
  description?: string
  price: number
  views: number
  type: number
}

const colors = [
  "pink",
  "red",
  "yellow",
  "orange",
  "cyan",
  "green",
  "blue",
  "purple",
  "geekblue",
  "magenta",
  "volcano",
  "gold",
  "lime",
]

const BookTypesArray = getEnumArray(BookTypes)

function BookPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [tempBook, setTempBook] = useState<Book | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [bookForm] = Form.useForm<Book>()
  const [newBookForm] = Form.useForm<Book>()
  const [rateValue, setRateValue] = useState(2.5)
  const [rateText, setRateText] = useState("")

  const columns: ColumnsType<Book> = [
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "书名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "简介",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "借阅量",
      dataIndex: "views",
      key: "views",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (_, { type }) => (
        <Tag color={colors[type % 13]}>
          {type}: {BookTypes[type]}
        </Tag>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, book) => {
        return (
          <div>
            <a
              onClick={() => {
                setTempBook(book)
                setIsModalVisible(true)
              }}
            >
              评价
            </a>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    fetch("/api/book")
      .then((res) => res.json())
      .then((i) => {
        setBooks(i)
        console.log(i)
      })
  }, [])

  return (
    <div>
      <Table columns={columns} dataSource={books} rowKey="isbn" />
      <Modal
        title="评价"
        cancelText="取消"
        okText="提交"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          fetch(`/api/posts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isbn: tempBook?.isbn,
              rate: rateValue,
              content: rateText,
              userId: localStorage.getItem("id"),
            }),
          })
            .then((res) => {
              if (res.status === 200) {
                message.success("评价成功")
              } else {
                message.error("评价失败")
              }
            })
            .finally(() => setIsModalVisible(false))
        }}
      >
        <Rate
          allowHalf
          value={rateValue}
          onChange={(e) => setRateValue(e.valueOf())}
        />
        <TextArea
          placeholder="评价"
          autoSize={{ minRows: 3, maxRows: 5 }}
          style={{ marginTop: "10px" }}
          onChange={(e) => setRateText(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default BookPage
