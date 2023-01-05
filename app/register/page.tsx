"use client"

import React from "react"
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Form, Input } from "antd"

export default function Register() {
  const handleRegister = async (values: {
    username: string
    password: string
    email: string
  }) => {
    console.log(values)
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
  }

  return (
    <div className="flex my-30 mx-auto w-80 pt-5 justify-center items-center bg-gradient-to-r from-blue-200 to-sky-500 rounded-xl shadow-2xl">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleRegister}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "用户名不能为空！" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="用户名"
            
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "密码不能为空!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "邮箱不能为空!" }]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="邮箱"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button mx-20"
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
