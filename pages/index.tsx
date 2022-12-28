import React, { useEffect, useState } from "react";
import { DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import abi from "../abi.json";

import { List, Card, Badge, Tag } from "antd";
import { users } from "../services/storage";
import { contractAddress, useNFTs } from "../services/hooks";
import {
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
  useContractRead,
  useContractReads,
} from "wagmi";

const App: React.FC = () => {
  const [deleteId, setDeleteId] = useState();

  const { config, isSuccess } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "burn",
    args: [Number(deleteId)],
  });
  const { activeNFTs: collectionData, isLoading } = useNFTs();

  const address = {
    address: contractAddress,
    abi,
    functionName: "tokenURI",
  };

  const { data: totalSupply } = useContractRead({
    ...address,
    functionName: "totalSupply",
  });
  console.log(totalSupply);

  const { data, write, status } = useContractWrite(config);

  const deleteNFT = async (index: number, write: any) => {
    write();
  };

  useEffect(() => {
    console.log({ isSuccess, deleteId, write });
    if (isSuccess && deleteId && write) {
      write();
    }
  }, [deleteId, isSuccess]);
  return (
    <>
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
    </>
  );
};

export default App;
