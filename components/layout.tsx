import React, { useEffect, useState, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { EyeOutlined, FireOutlined } from "@ant-design/icons";

import { Layout, Menu, theme } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

const { Content, Sider } = Layout;

const sidebars = [
  {
    key: "/",
    icon: React.createElement(EyeOutlined),
    label: "Active Vouchers",
  },
  {
    key: "/burned",
    icon: React.createElement(FireOutlined),
    label: "Used Vouchers",
  },
  { key: "/mint", icon: React.createElement(PlusOutlined), label: "Mint" },
];
const App: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [selected, setSelected] = useState("/");

  useEffect(() => {
    setSelected(router.route);
  }, [router.route]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: colorBgContainer }}>
        <Menu
          onClick={({ key }) => router.push(key)}
          mode="inline"
          defaultSelectedKeys={["/"]}
          selectedKeys={[selected]}
          items={sidebars}
        />
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <div style={{ margin: "16px 0", alignSelf: "end" }}>
          <ConnectButton />
        </div>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            height: "100%",
          }}
        >
          <main>{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
