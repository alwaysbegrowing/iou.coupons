import React, { useEffect } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Checkbox, Form, Input, Button, List, Card } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { BigNumber } from 'ethers';
import abi from '../abi.json'
import useSWR from 'swr'




const { Content, Sider } = Layout;

const fetcher = (url: string) => fetch(url).then(res => res.json())

const url = "https://opt-goerli.g.alchemy.com/v2/ObMPjIMbmavofeNgNPVzHQ2jUldCe3i9/getNFTsForCollection?contractAddress=0xdF34022e8a280fc79499cA560439Bb6f9797EbD8&pageSize=100&withMetadata=true"

const items1: MenuProps['items'] = ['1'].map((key) => ({
  key,
  label: `View ${key}`,
}));

const data1 = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
];



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


const sidebars = [{ key: "test1", icon: React.createElement(UserOutlined), label: "Create Voucher" }]
const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: collectionData, error } = useSWR(url, fetcher)
  console.log({ collectionData })

  const { config } = usePrepareContractWrite({
    address: '0xdF34022e8a280fc79499cA560439Bb6f9797EbD8',
    abi,
    functionName: 'safeMint',
    args: ["0xcafea1A2c9F4Af0Aaf1d5C4913cb8BA4bf0F9842", 'test']
  })




  const { data, isLoading, isSuccess, write } = useContractWrite(config)
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

          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={collectionData?.nfts}
            renderItem={(item) => (
              <List.Item>
                <Card title={item?.id?.tokenId}>Card content</Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout >
  );
};

export default App;