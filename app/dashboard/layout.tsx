"use client"

import {
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  CommentOutlined,
  LikeOutlined,
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
              
              <Menu.Item icon={<BookOutlined />} key={"BorrowManage"}>
                <Link href={"/dashboard/borrow"}>借阅管理</Link>
              </Menu.Item>
              
              <Menu.Item icon={<CommentOutlined />} key={"PostsManage"}>
                <Link href={"/dashboard/posts"}>书籍评价</Link>
              </Menu.Item>
              
              <Menu.Item icon={<UserOutlined />} key={"AccountManage"}>
                <Link href={"/dashboard/account"}>个人信息</Link>
              </Menu.Item>

              <Menu.Item icon={<LikeOutlined />} key={"PostsBroadcast"}>
                <Link href={"/dashboard/postsBroadcast"}>评价公告板</Link>
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
