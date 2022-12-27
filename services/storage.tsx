import { NFTStorage } from "nft.storage";

const NFT_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3ZGI1MDRCRDg0NzMyMThjQTYzQ0RhYjAwZkFiZkM5YTE3RGIzRDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MTg5NjQ4OTQ0NywibmFtZSI6IkZJbGVVcGxvYWQifQ.51sVxrzsYvblfStHgksTa8rk0h_gaRxk_KAWFEmz0X8";

export const client = new NFTStorage({ token: NFT_API_KEY });

export async function getExampleImage(imageURL: string) {
  console.log({ imageURL });
  const r = await fetch(imageURL);
  if (!r.ok) {
    throw new Error(`error fetching image: [${r.statusText}]: ${r.status}`);
  }
  return r.blob();
}

export const users: any = {
  "0xcafea1A2c9F4Af0Aaf1d5C4913cb8BA4bf0F9842": "bookland.eth",
  // "0xcc1A924Bef4C12c17bf99E32E015f6a275C2F833": "bookland.eth",
  "0xeEf148cF42670b3e80886FE19d651958E263c09A": "namaskar.eth",
  "0x6ef65656e263205bcf8930c5cf4be22a8579f7f1": "bookcliff.eth",
};

export const userList = Object.keys(users).map((key) => ({
  value: key,
  label: users[key],
}));
