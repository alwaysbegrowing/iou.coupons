import React, { useEffect, useState, useCallback } from 'react';
import { LaptopOutlined, NotificationOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { EditOutlined, EllipsisOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

import { Layout, Menu, theme, Form, Input, Button, List, Card } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import useSWR from 'swr'


const fetcher = (url: string) => fetch(url).then(res => res.json())

const url = "https://opt-goerli.g.alchemy.com/v2/ObMPjIMbmavofeNgNPVzHQ2jUldCe3i9/getNFTsForCollection?contractAddress=0x0271afEcb551bC642057C3e2A3191f5b8D80B08b&pageSize=100&withMetadata=true"


const App: React.FC = () => {
  const [metadata, setMetadata] = useState('')
  const { address } = useAccount()

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { data: collectionData } = useSWR(url, fetcher)
  console.log({ collectionData })









  return (

    <>


      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={collectionData?.nfts}
        renderItem={(item) => (
          <List.Item>
            <Card   loading={!item.media[0].gateway} hoverable cover={<img alt="test" src={item.media[0].gateway || null } />} actions={[
              <DeleteOutlined key="setting" />,
            ]} >
              <Card.Meta title={item.title} description={item.description}> </Card.Meta>
            </Card>
          </List.Item>
        )}
      />
    </>

  );
};

export default App;