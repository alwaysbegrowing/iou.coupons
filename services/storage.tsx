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
