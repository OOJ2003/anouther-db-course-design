"use client"

import "@css/global.css"
import "@css/dashboard.css"

import { useEffect, useState } from "react"

import Table, { ColumnsType } from "antd/es/table"
import { Button, Form, message, Tag } from "antd"
import { ModalForm, ProFormText, ProTable } from "@ant-design/pro-components"
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

function BorrowPage() {
  const [inventory, setInventory] = useState<Column[]>([])
  const [checkBorrowSet, setCheckBorrowSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    getInventory()
      .then((data) => {
        setInventory(data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    fetch(`/api/borrow`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("id"),
      }),
    }).then((res) => {
      res.json().then((data) => {
        const set = new Set<number>()
        data.data.borrows.forEach((i: any) => {
          if (!i.isReturn) set.add(i.bookId)
        })
        setCheckBorrowSet(set)
      })
    })
  }, [])

  const columns: ColumnsType<Column> = [
    {
      title: "??????",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      sorter: {
        compare: (a, b) => {
          return a.isbn.localeCompare(b.isbn) > 0 ? 1 : -1
        },
        multiple: 1,
      },
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "??????",
      dataIndex: "sums",
      key: "sums",
    },
    {
      title: "??????",
      dataIndex: "rest",
      key: "rest",
    },
    {
      title: "??????",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "??????",
      dataIndex: "status",
      key: "status",
      render: (_, i) => {
        return (
          <>
            <Tag color={i.status ? "green" : "orange"}>
              {i.status ? "??????" : "??????"}
            </Tag>
            {!checkBorrowSet.has(i.id) ? null : (
              <Tag color="volcano">?????????</Tag>
            )}
          </>
        )
      },
    },
    {
      title: "??????",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div>
            {record.status ? (
              <a
                onClick={() => {
                  fetch(`/api/inventory`, {
                    method: "put",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: localStorage.getItem("id"),
                      bookId: record.id,
                    }),
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        message.success("????????????")
                      } else {
                        message.error("????????????")
                      }
                    })
                    .catch((e) => {
                      console.log(e)
                      message.error("????????????")
                    })
                    .finally(() => {
                      window.location.reload()
                    })
                }}
              >
                ??????
              </a>
            ) : null}
            {!checkBorrowSet.has(record.id) ? null : (
              <a
                onClick={() => {
                  fetch(`/api/borrow`, {
                    method: "put",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      bookId: record.id,
                    }),
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        message.success("????????????")
                      } else {
                        message.error("????????????")
                      }
                    })
                    .catch((e) => {
                      console.log(e)
                      message.error("????????????")
                    })
                    .finally(() => {
                      window.location.reload()
                    })
                }}
              >
                ??????
              </a>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <p>
        ???????????????{checkBorrowSet.size}??????
      </p>
      <Table<Column> columns={columns} dataSource={inventory} rowKey="id" />
    </div>
  )
}

export default BorrowPage
