import React, { useEffect, useState } from "react";

import {
  Layout,
  Menu,
  theme,
  Form,
  Input,
  Button,
  List,
  Card,
  Spin,
} from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import abi from "../abi.json";
import useSWR from "swr";
import { NFTStorage } from "nft.storage";
import { StepFunctionsStartExecution } from "aws-cdk-lib/aws-stepfunctions-tasks";
const { Content, Sider } = Layout;
const deepai = require("deepai");
import { Alert } from "antd";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [form] = Form.useForm();

  const [metadata, setMetadata] = useState("");

  const [mint, setMint] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { config, isSuccess: isSuccess2 } = usePrepareContractWrite({
    address: "0x0271afEcb551bC642057C3e2A3191f5b8D80B08b",
    abi,
    functionName: "safeMint",
    args: [address, metadata],
  });

  const client = new NFTStorage({ token: NFT_API_KEY });

  const { data, isLoading, isSuccess, write, status } = useContractWrite(
    config
  );

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess]);
  const onFinish = async (values: any) => {
    setLoading(true);
    console.log("Success:", values);
    deepai.setApiKey("8557e47b-aaf7-4db7-9bea-06957c7dafb4");

    var resp = await deepai.callStandardApi("fantasy-world-generator", {
      text: values.description + " " + values.name,
      grid_size: "1",
    });
    console.log(resp);
    const image = await getExampleImage(resp.output_url);

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
    setLoading(false);
  };

  useEffect(() => {
    console.log("go", metadata, write, data);
    if (isSuccess2 && metadata) {
      write();
    }
  }, [isSuccess2, mint, metadata]);

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
