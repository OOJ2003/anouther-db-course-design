"use client"

import { useState, useEffect } from "react"
import "@css/global.css"
import "@css/dashboard.css"
import { Avatar, List, message, Modal, Input, Form } from "antd"
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"

type User = {
  id: number
  username: string
  email: string
  sex?: string 
  password?: string
}

function AccountPage() {
  const [user, setUser] = useState<User>()
  const [userForm] = Form.useForm<User>()

  useEffect(() => {
    fetch(`/api/user/id/${localStorage.getItem("id")}`)
      .then((res) => res.json())
      .then((i: { data: User }) => {
        console.log(i.data)
        setUser(i.data)
      })
  }, [])

  return (
    <div>
      {user === undefined ? null : (
        <ProForm<User>
          form={userForm}
          onFinish={async (values) => {
            const temp = { ...values, id: user.id }
            const res =  await fetch("/api/user/update", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(temp),
            })
            if (res.status === 200) {
              message.success("修改成功")
            } else {
              message.error("修改失败")
            }
          }}

        >
          <ProFormText
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
            initialValue={user?.username}
          />
          <ProFormText
            name="email"
            label="邮箱"
            rules={[{ required: true, message: "请输入邮箱" }]}
            initialValue={user?.email}
          />
          <ProFormText
            name="password"
            label="密码"
            placeholder={"不修改密码请留空"}
          />
          <ProFormSelect
            name="sex"
            label="性别"
            options={[
              { label: "男", value: "男" },
              { label: "女", value: "女" },
            ]}
            initialValue={user?.sex}
          />
        </ProForm>
      )}
    </div>
  )
}

export default AccountPage
