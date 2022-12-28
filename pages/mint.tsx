import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Layout, theme, Form, Input, Button, Spin, Select } from "antd";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import abi from "../abi.json";
const deepai = require("deepai");
import { Alert } from "antd";
import { useRouter } from "next/router";
import { contractAddress } from "../services/hooks";
import { client, getExampleImage, userList } from "../services/storage";
import { users } from "../services/storage";

const App: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { isConnected, address } = useAccount();

  const [metadata, setMetadata] = useState("");

  const [mint, setMint] = useState(false);
  const [loading, setLoading] = useState(false);

  const { config, isSuccess: isSuccess2 } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "safeMint",
    args: [address, metadata],
  });

  const { data, isLoading, isSuccess, write, status } = useContractWrite(
    // @ts-ignore
    config
  );

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    deepai.setApiKey("8557e47b-aaf7-4db7-9bea-06957c7dafb4");

    var resp = await deepai.callStandardApi("fantasy-world-generator", {
      text: values.description + " " + values.name,
      grid_size: "1",
    });
    const image = await getExampleImage(resp.output_url);

    const nft = {
      image,
      name: values.name,
      description: values.description,
      authors: [{ name: address }],
      from: address,
      to: values.to,
    };
    const metadata = await client.store(nft);

    setMint((flag) => !flag);
    setMetadata(metadata.url);
    setLoading(false);
  };

  useEffect(() => {
    if (isSuccess2 && metadata && write) {
      write();
    }
  }, [isSuccess2, mint, metadata]);

  if (!isConnected)
    return (
      <>
        Please connect your wallet to create a voucher
        <ConnectButton></ConnectButton>
      </>
    );

  if (address && !users[address]) {
    return "this account is not allowed to mint";
  }
  return (
    <>
      <Spin spinning={loading || isLoading}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ remember: true }}
          requiredMark={false}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Recipient"
            name="to"
            rules={[{ required: true, message: "Please enter a recipient" }]}
          >
            <Select options={userList} />
          </Form.Item>

          <Form.Item
            label="Voucher Name"
            name="name"
            rules={[
              { required: true, message: "Please input a voucher name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
            <Button type="primary" htmlType="submit">
              Mint
            </Button>
          </Form.Item>
        </Form>
        {isSuccess && (
          <Alert
            message="Successfully minted"
            action={
              <Button onClick={() => router.push("/")} size="small" type="text">
                View
              </Button>
            }
            type="success"
          />
        )}
      </Spin>
    </>
  );
};

export default App;
