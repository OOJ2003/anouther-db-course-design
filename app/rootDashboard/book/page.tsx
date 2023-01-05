"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"

import Table, { ColumnsType } from "antd/es/table"
import { Button, Form, Tag } from "antd"
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components"
import { getEnumArray } from "enum-array"

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
      title: "浏览量",
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
              编辑
            </a>
            <a
              onClick={() => {
                fetch(`/api/book`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ isbn: book.isbn }),
                })
              }}
            >
              删除
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
      <ModalForm<Book>
        title="添加书籍"
        form={newBookForm}
        autoFocusFirstInput
        trigger={<Button>添加图书</Button>}
        onFinish={async (values) => {
          console.log(values)
          fetch("/api/book", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
        }}
      >
        <ProFormText
          name="isbn"
          label={"ISBN"}
          rules={[
            { required: true, message: "请输入ISBN" },

            {
              validator(_rule, value: string) {
                const patten =
                  /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
                if (!patten.test(value)) {
                  return Promise.reject("ISBN格式错误")
                }
              },
            },
          ]}
          placeholder={""}
        />

        <ProFormText
          name="name"
          label={"书名"}
          initialValue={tempBook?.name}
          rules={[{ required: true, message: "请输入书名" }]}
          placeholder={""}
        />

        <ProFormText
          name="author"
          label={"作者"}
          rules={[{ required: true, message: "请输入作者" }]}
          placeholder={""}
        />

        <ProFormTextArea name="description" label={"简介"} placeholder={""} />

        <ProFormText
          name="price"
          label={"价格"}
          rules={[
            {
              validator(_rule, value: any) {
                const patten = /^[0-9]+(.[0-9]{1,2})?$/
                if (!patten.test(value.trim())) {
                  return Promise.reject("请输入正确的价格")
                }
              },
            },
          ]}
          placeholder={""}
        />

        <ProFormSelect
          name="type"
          label={"类型"}
          initialValue={1}
          options={BookTypesArray.map((i) => ({
            label: `${i.key}: ${i.value}`,
            value: i.key,
          }))}
          rules={[{ required: true, message: "请选择类型" }]}
        />
      </ModalForm>

      <br />
      <Table columns={columns} dataSource={books} rowKey="isbn" />
      <ModalForm<Book>
        open={isModalVisible}
        title="编辑书籍"
        form={bookForm}
        autoFocusFirstInput
        modalProps={{
          onCancel(e) {
            setIsModalVisible(false)
          },
        }}
        onFinish={async (values) => {
          console.log(values)
          setIsModalVisible(false)
        }}
      >
        <ProFormText
          name="isbn"
          label={"ISBN"}
          initialValue={tempBook?.isbn}
          rules={[
            { required: true, message: "请输入ISBN" },

            {
              validator(_rule, value: string) {
                const patten =
                  /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
                if (!patten.test(value)) {
                  return Promise.reject("ISBN格式错误")
                }
              },
            },
          ]}
        />

        <ProFormText
          name="name"
          label={"书名"}
          initialValue={tempBook?.name}
          rules={[{ required: true, message: "请输入书名" }]}
        />

        <ProFormText
          name="author"
          label={"作者"}
          initialValue={tempBook?.author}
        />

        <ProFormTextArea
          name="description"
          label={"简介"}
          initialValue={tempBook?.description}
        />

        <ProFormText
          name="price"
          label={"价格"}
          initialValue={tempBook?.price}
          rules={[
            {
              validator(_rule, value: any) {
                const patten = /^[0-9]+(.[0-9]{1,2})?$/
                if (!patten.test(value.trim())) {
                  return Promise.reject("请输入正确的价格")
                }
              },
            },
          ]}
        />

        <ProFormSelect
          name="type"
          label={"类型"}
          initialValue={tempBook ? BookTypes[tempBook.type] : undefined}
          options={BookTypesArray.map((i) => ({
            label: `${i.key}: ${i.value}`,
            value: i.key,
          }))}
          rules={[{ required: true, message: "请选择类型" }]}
        />
      </ModalForm>
    </div>
  )
}

export default BookPage
