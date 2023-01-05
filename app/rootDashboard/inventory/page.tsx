"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"

import Table, { ColumnsType } from "antd/es/table"
import { Button, Form, message, Tag } from "antd"
import { ModalForm, ProFormText } from "@ant-design/pro-components"
import { PlusOutlined } from "@ant-design/icons"

type Inventory = {
  name: string
  inventory: {
    isbn: string
    sums: number
    rest: number
  }
  lib: {
    id: number
    location: string
    isbn: string
    status: boolean
  }[]
}

type Column = {
  id: number
  isbn: string
  name: string
  sums: number
  rest: number
  location: string
  status: boolean
}


const getInventory: () => Promise<Column[]> = async () => {
  const res = await fetch("/api/inventory", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data: Inventory[] = (await res.json()).data
  return data
    .map((i) => {
      return i.lib.map((j) => {
        return {
          id: j.id,
          isbn: j.isbn,
          name: i.name,
          sums: i.inventory.sums,
          rest: i.inventory.rest,
          location: j.location,
          status: j.status,
        }
      })
    })
    .flat()
    .sort((a, b) => a.id - b.id)
}



function InventoryPage() {
  const [inventory, setInventory] = useState<Column[]>([])
  const [newInventory] = Form.useForm<{ isbn: string; location: string }>()
  
  

  useEffect(() => {
    getInventory()
      .then((data) => {
        setInventory(data)
        console.log(data)
      })
      .catch((e) => console.log(e))
  }, [])




  const columns: ColumnsType<Column> = [
    {
      title: "书名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      sorter: {
        compare: (a, b) => a.isbn.localeCompare(b.isbn),
        multiple: 1,
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "总数",
      dataIndex: "sums",
      key: "sums",
    },
    {
      title: "剩余",
      dataIndex: "rest",
      key: "rest",
    },
    {
      title: "位置",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <Tag color={status ? "green" : "red"}>{status ? "在库" : "借出"}</Tag>
        )
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div>
            <a
              onClick={() => {
                fetch(`/api/inventory`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: record.id,
                  }),
                })
                  .then((_) => {
                    message.success("删除成功")
                  })
                  .catch((e) => {
                    console.log(e)
                    message.error("删除失败")
                  })
                  .finally(() => {
                    getInventory()
                      .then((data) => {
                        setInventory(data)
                      })
                      .catch((e) => console.log(e))
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

  

  return (
    <div>
      <ModalForm<{ isbn: string; location: string }>
        title="添加库存记录"
        form={newInventory}
        autoFocusFirstInput
        trigger={
          <Button>
            <PlusOutlined />
            添加库存记录
          </Button>
        }
        onFinish={async (values) => {
          fetch("/api/inventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isbn: values.isbn,
              location: values.location,
            }),
          })
            .then((_) => {
              message.success("添加成功")
              getInventory()
                .then((data) => {
                  setInventory(data)
                })
                .catch((e) => console.log(e))
            })
            .catch((e) => {
              console.log(e)
              message.error("添加失败")
            })
        }}
      >
        <ProFormText
          name="isbn"
          label="ISBN"
          placeholder={"ISBN必须为在图书管理中已存在的书籍的ISBN"}
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
          name="location"
          label="位置"
          placeholder="请输入位置"
          rules={[{ required: true, message: "请输入位置" }]}
        />
      </ModalForm>
      <Table columns={columns} dataSource={inventory} rowKey="id"></Table>
    </div>
  )
}

export default InventoryPage
