import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Checkbox, Form, Input, Button } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi'
import { BigNumber } from 'ethers';
import abi from '../abi.json'

const { Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1'].map((key) => ({
  key,
  label: `View ${key}`,
}));




const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,


    };
  },
);

// 0x031b3b4bfEBDBfbECc20c41Bd058e3b81666894E

const sidebars = [{ key: "test1", icon: React.createElement(UserOutlined), label: "Create Voucher" }]
const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const { config } = usePrepareContractWrite({
    address: '0x031b3b4bfEBDBfbECc20c41Bd058e3b81666894E',
    abi,
    functionName: 'safeMint',
    args: ["0xcafea1A2c9F4Af0Aaf1d5C4913cb8BA4bf0F9842", BigNumber.from(1), 'test']
  })

  const { data: readData, isError } = useContractRead({
    address: '0x031b3b4bfEBDBfbECc20c41Bd058e3b81666894E',
    abi,
    functionName: 'getHunger',
  })

  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  console.log({ isSuccess, data })
  const onFinish = (values: any, write: any) => {
    console.log('Success:', values);
    write()
  };
  return (

    < Layout style={{ height: "100vh" }
    } >
      <Sider width={200} style={{ background: colorBgContainer }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={sidebars}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <div style={{ margin: '16px 0' }}>
          <ConnectButton />
        </div>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            height: "100%"
          }}
        >

          <Form
            name="basic"
            labelCol={{ span: 2 }}

            initialValues={{ remember: true }}
            onFinish={(values) => onFinish(values, write)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Voucher Name"
              name="voucher name"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input />
            </Form.Item>



            <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout >
  );
};

export default App;