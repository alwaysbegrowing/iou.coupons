import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import abi from "../abi.json";

import { List, Card } from "antd";
import { client, getExampleImage } from "../services/storage";
import { contractAddress, useNFTs } from "../services/hooks";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";

const App: React.FC = () => {
  // const { config, isSuccess: isSuccess2, error } = usePrepareContractWrite({
  //   address: contractAddress,
  //   abi,
  //   functionName: "burn",
  //   args: [

  //   ],
  // });
  const { data: collectionData } = useNFTs();

  // const { data, isLoading, isSuccess, write, status } = useContractWrite(
  //   config
  // );

  const deleteNFT = async (index: number, write: any) => {
    write();
  };
  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={collectionData}
        renderItem={(item: any, index: number) => (
          <List.Item>
            <Card
              loading={!item.media[0].gateway}
              hoverable
              cover={
                item.media[0].gateway ? (
                  <img alt="test" src={item.media[0].gateway} />
                ) : null
              }
              // actions={[<DeleteOutlined onClick={write} key="setting" />]}
            >
              <Card.Meta
                title={item.title}
                description={item.description}
              ></Card.Meta>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default App;
