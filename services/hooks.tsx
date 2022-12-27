import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const baseURL = "https://opt-goerli.g.alchemy.com/v2/";
const key = "ObMPjIMbmavofeNgNPVzHQ2jUldCe3i9";
const zeroAddresss = "0x0000000000000000000000000000000000000000";
export const contractAddress = "0x51aA92d676a7BBfD6Fb033aED1CA91e0A658c1F3";
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
  const url = `${baseURL}${key}/getNFTsForCollection?contractAddress=${contractAddress}&pageSize=100&withMetadata=true`;
  const { data: burnedNFTs } = useBurned();
  const { data: allNFTs } = useSWR(url, fetcher);

  const burnedIDs = burnedNFTs?.map((burned: any) => burned.id.tokenId);
  const filteredNFTs = allNFTs?.nfts.filter(
    (val: any) => !burnedIDs?.includes(val.id.tokenId)
  );
  return { data: filteredNFTs };
};
