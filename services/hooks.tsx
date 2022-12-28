import useSWR from "swr";
import abi from "../abi.json";
import { useContractReads } from "wagmi";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const baseURL = "https://opt-goerli.g.alchemy.com/v2/";
const key = "ObMPjIMbmavofeNgNPVzHQ2jUldCe3i9";
const zeroAddresss = "0x0000000000000000000000000000000000000000";
export const contractAddress = "0x210BEFFf236c0110fb1A7c3cde9CEEcbBD896681";
export const useBurned = () => {
  const url = `${baseURL}${key}/getNFTs?owner=${zeroAddresss}&contractAddresses[]=${contractAddress}`;
  const { data, isLoading, error } = useSWR(url, fetcher);

  return {
    data: data?.ownedNfts,
    isLoading,
    isError: error,
  };
};

export const useNFTs = () => {
  const address = {
    address: contractAddress,
    abi,
    functionName: "tokenURI",
  };

  const url = `${baseURL}${key}/getNFTsForCollection?contractAddress=${contractAddress}&pageSize=100&withMetadata=true`;
  const { data: allNFTs, isLoading: isLoadingAll } = useSWR(url, fetcher);
  const {
    data: metaDataURLs,
    isLoading: isLoadingBurned,
    isError,
  } = useContractReads({
    allowFailure: true,
    watch: true,
    contracts: allNFTs?.nfts?.map((_: any, index: number) => ({
      ...address,
      args: [index],
    })),
  });
  const activeNFTs: any = [];
  const burnedNFTs: any = [];

  metaDataURLs?.forEach((url, index) => {
    if (url != null) {
      activeNFTs.push(allNFTs.nfts[index]);
    } else {
      burnedNFTs.push(allNFTs.nfts[index]);
    }
  });
  return { activeNFTs, burnedNFTs, isLoading: isLoadingBurned || isLoadingAll };
};
