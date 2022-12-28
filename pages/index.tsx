import React, { useEffect, useState } from "react";
import { DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import contractABI from "../abi.json";

import { List, Card, Badge, Tag, ConfigProvider, Empty, Button } from "antd";
import { users } from "../services/storage";
import { contractAddress, useNFTs } from "../services/hooks";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import Link from "next/link";

const App: React.FC = () => {
  const abi = contractABI as readonly {}[];

  const [deleteId, setDeleteId] = useState();

  const { config, isSuccess } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "burn",
    args: [Number(deleteId)],
  });
  const { activeNFTs: collectionData, isLoading } = useNFTs();
  // @ts-ignore
  const { write } = useContractWrite(config);

  const deleteNFT = async (index: number, write: any) => {
    write();
  };

  useEffect(() => {
    if (isSuccess && deleteId && write) {
      write();
    }
  }, [deleteId, isSuccess]);
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span>There are no current vouchers</span>}
        >
          <Link href="/mint">
            <Button type="primary">Create Voucher</Button>
          </Link>
        </Empty>
      )}
    >
      <List
        loading={isLoading}
        grid={{ gutter: 16, column: 4 }}
        dataSource={collectionData}
        renderItem={(item: any, index: number) => (
          <List.Item>
            <Badge.Ribbon
              text={
                item?.metadata?.to
                  ? `To: ${users[item.metadata.to]}`
                  : "loading..."
              }
            >
              <Card
                loading={!item.media[0].gateway}
                hoverable
                cover={
                  item.media[0].gateway ? (
                    <img alt="test" src={item.media[0].gateway} />
                  ) : null
                }
                actions={[
                  <DeleteOutlined
                    onClick={() => setDeleteId(item.id.tokenId)}
                    key="setting"
                  />,
                ]}
              >
                <Card.Meta
                  title={item.title}
                  description={item.description}
                ></Card.Meta>
                <Tag style={{ marginTop: 16 }} icon={<GiftOutlined />}>
                  {users[item.metadata.from]}
                </Tag>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />
    </ConfigProvider>
  );
};

export default App;
