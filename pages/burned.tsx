import React from "react";
import { List, Card } from "antd";
import { useNFTs } from "../services/hooks";

const App: React.FC = () => {
  const { burnedNFTs } = useNFTs();
  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={burnedNFTs}
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
