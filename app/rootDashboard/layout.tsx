"use client"

import {
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MessageOutlined,
  CommentOutlined,
  BankOutlined,
} from "@ant-design/icons"
import "@css/global.css"
import handleLogout from "@utils/logout"
import { Layout, Menu } from "antd"
import { Content, Footer } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              // console.log(broken)
            }}
            onCollapse={(collapsed, type) => {
              // console.log(collapsed, type)
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
              <Menu.Item icon={<BookOutlined />} key={"BooksManage"}>
                <Link href={"/rootDashboard/book"}>图书管理</Link>
              </Menu.Item>
              {/* <BankOutlined /> */}
              <Menu.Item icon={<BankOutlined />} key={"InventoryManage"}>
                <Link href={"/rootDashboard/inventory"}>图书库存管理</Link>
              </Menu.Item>

              <Menu.Item icon={<UserOutlined />} key={"AccountsManage"}>
                <Link href={"/rootDashboard/account"}>账户管理</Link>
              </Menu.Item>
              <Menu.Item icon={<CommentOutlined />} key={"PostsManage"}>
                <Link href={"/rootDashboard/posts"}>评论管理</Link>
              </Menu.Item>
              <Menu.Item
                icon={<LogoutOutlined />}
                key={"Logout"}
                onClick={() => handleLogout()}
              >
                <a>登出</a>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: "24px 16px 0" }}>{children}</Content>
            <Footer style={{ textAlign: "center" }}></Footer>
          </Layout>
        </Layout>
      </body>
    </html>
  )
}
