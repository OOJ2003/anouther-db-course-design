"use client"

import { useState, useEffect } from "react"
import "@css/global.css"
import "@css/dashboard.css"
import { Avatar, List, message, Modal, Input } from "antd"


type Account = {
  id: number
  username: string
  email: string
  type: "admin" | "normal"
  sex: string | null
}

function Account() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tempUserId, setTempUserId] = useState(0)
  const [newPassword, setNewPassword] = useState("")

  const getAndSetAccounts = () => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((i: { data: Account[] }) => setAccounts(i.data))
  }

  useEffect(() => {
    getAndSetAccounts()
  }, [])

  const handleOk = () => {
    setIsModalVisible(false)
    const body = JSON.stringify({
      id: tempUserId,
      password: newPassword,
    })
    console.log(body)
    fetch("/api/user/update", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((_i) => {
        message.success("修改密码成功")
      })
      .catch((_e) => {
        message.error("未知错误")
      })
  }

  return (
    <div>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        cancelText="取消"
        okText="提交"
      >
        <Input
          placeholder="请输入新密码"
          defaultValue={"12345"}
          onChange={(e) => {
            setNewPassword(e.target.value)
          }}
          onPressEnter={(_e) => {
            handleOk()
          }}
        />
      </Modal>

      <List
        // itemLayout="vertical"
        bordered={true}
        dataSource={accounts}
        size={"large"}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <a
                onClick={() => {
                  const temp = item.type == "admin" ? "normal" : "admin"
                  fetch("/api/user/update", {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: item.id,
                      type: temp,
                    }),
                  }).then((_i) => {
                    getAndSetAccounts()
                    message.success("修改权限成功")
                  })
                }}
              >
                账户权限转换
              </a>,
              <a
                onClick={() => {
                  fetch("/api/user/delete", {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: item.id,
                    }),
                  }).then((_i) => {
                    getAndSetAccounts()
                    message.success("删除成功")
                  })
                }}
              >
                删除
              </a>,
              <a
                onClick={() => {
                  setTempUserId(item.id)
                  setIsModalVisible(true)
                }}
              >
                修改密码
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <div>
                  <br />
                  <Avatar src={"/avatar.png"} size={"large"} />
                  <p>{item.username}</p>
                </div>
              }
              description={
                <div>
                  <p>
                    用户ID: {item.id} <br />
                    性别：{item.sex !== null ? item.sex : "未填写"} <br />
                    email: {item.email} <br />
                    账户类型: {item.type === "admin" ? "管理员" : "普通"}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default Account
