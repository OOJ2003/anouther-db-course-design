"use client";

import React from "react"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { LoginFormPage, ProFormText } from "@ant-design/pro-components"
import { Button, Divider } from "antd"
import Link from "next/link"

const handleLogin = async (username: string, password: string) => {
  // todo
}

function Home() {
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "calc(100vh - 48px)",
        margin: -24,
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        title="图书管理借阅系统"
        subTitle="数据库大作业：by程晖-李铭轩-王书羊"
        onFinish={async (e) => handleLogin(e.username, e.password)}
        activityConfig={{
          style: {
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
            color: "#fff",
            borderRadius: 8,
            backgroundColor: "#1677FF",
          },
          title: "You're getting rickrolled :)",
          action: (
            <Button
              size="large"
              style={{
                borderRadius: 20,
                background: "#fff",
                color: "#1677FF",
                width: 120,
              }}
              onClick={() => {
                const roll = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                window.location.href = roll
              }}
            >
              sus
            </Button>
          ),
        }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Divider plain>
              <span
                style={{ color: "#CCC", fontWeight: "normal", fontSize: 14 }}
              >
                <Link href={"/register"}>点击创建新账户</Link>
              </span>
            </Divider>
          </div>
        }
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"用户ID:"}
          rules={[
            {
              required: true,
              message: "请输入用户ID!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder={"密码:"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
      </LoginFormPage>
    </div>
  )
}

export default Home