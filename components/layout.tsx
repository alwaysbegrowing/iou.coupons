import React, { useEffect, useState, useCallback } from 'react';
import { LaptopOutlined, NotificationOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { EditOutlined, EllipsisOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

import { Layout, Menu, theme, Form, Input, Button, List, Card } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite, usePrepareContractWrite, useAccount } from 'wagmi'
import { useRouter } from 'next/router';


const { Content, Sider } = Layout;



const sidebars = [{ key: "/", icon: React.createElement(PlusOutlined), label: "Create Voucher" }, { key: "all", icon: React.createElement(EyeOutlined), label: "All Vouchers" }]
const App: React.FC = ({ children }) => {
    const router = useRouter();


    const {
        token: { colorBgContainer },
    } = theme.useToken();




    return (

        < Layout style={{ height: "100vh" }
        } >
            <Sider width={200} style={{ background: colorBgContainer }}>
                <Menu
                    onClick={({key}) =>     router.push(key)}
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
                    <main>{children}</main>

                </Content>
            </Layout>
        </Layout >
    );
};

export default App;