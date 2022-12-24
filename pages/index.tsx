import React, { useEffect, useState } from "react";

import { Layout, Menu, theme, Form, Input, Button, List, Card } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import abi from "../abi.json";
import useSWR from "swr";
import { NFTStorage } from "nft.storage";
const { Content, Sider } = Layout;

const NFT_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3ZGI1MDRCRDg0NzMyMThjQTYzQ0RhYjAwZkFiZkM5YTE3RGIzRDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MTg5NjQ4OTQ0NywibmFtZSI6IkZJbGVVcGxvYWQifQ.51sVxrzsYvblfStHgksTa8rk0h_gaRxk_KAWFEmz0X8";

async function getExampleImage(imageURL: string) {
  const r = await fetch(imageURL);
  if (!r.ok) {
    throw new Error(`error fetching image: [${r.statusText}]: ${r.status}`);
  }
  return r.blob();
}

const App: React.FC = () => {
  const [metadata, setMetadata] = useState("");
  const [mint, setMint] = useState(false);
  const { address } = useAccount();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { config, isSuccess: isSuccess2 } = usePrepareContractWrite({
    address: "0x68DDa57a40C48213E2650E4b86ebcEF7a679Cb79",
    abi,
    functionName: "safeMint",
    args: [address, metadata],
  });

  const client = new NFTStorage({ token: NFT_API_KEY });

  const { data, isLoading, isSuccess, write, status } = useContractWrite(
    config
  );
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const image = await getExampleImage(
      "https://tse4.mm.bing.net/th?id=OIP.O4ikSivCInmY5l037ltIWwHaE8"
    );

    const nft = {
      image,
      name: values.name,
      description: values.description,
      authors: [{ name: address }],
    };
    const metadata = await client.store(nft);
    console.log("NFT data stored!");
    console.log("Metadata URI: ", metadata.url);
    setMint((flag) => !flag);
    setMetadata(metadata.url);
  };

  useEffect(() => {
    console.log("go", metadata, write, data);
    if (isSuccess2 && metadata) {
      write();
    }
  }, [isSuccess2, mint, metadata]);

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: true }}
        requiredMark={false}
        onFinish={(values) => onFinish(values)}
      >
        <Form.Item
          label="Voucher Name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Mint
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default App;
