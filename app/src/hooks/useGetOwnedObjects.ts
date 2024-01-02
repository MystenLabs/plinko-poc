import { useEffect, useState } from "react";
import { useSui } from "./useSui";
import { GeneralSuiObject } from "@/types/GeneralSuiObject";
import { useAuthentication } from "@/contexts/Authentication";

export const useGetOwnedObjects = () => {
  const { suiClient } = useSui();
  const { user: { address }} = useAuthentication();

  const [data, setData] = useState<GeneralSuiObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!!address) {
      reFetchData();
    } else {
      setData([]);
      setIsLoading(false);
      setIsError(false);
    }
  }, [address]);

  const reFetchData = async () => {
    setIsLoading(true);
    const allData = [];

    try {
      let { nextCursor, hasNextPage, data } = await suiClient.getOwnedObjects({
        owner: address!,
        options: {
          showContent: true,
          showType: true,
        },
      });
      allData.push(...data);

      while (!!hasNextPage) {
        const resp = await suiClient.getOwnedObjects({
          owner: address!,
          options: {
            showContent: true,
            showType: true,
          },
          ...(!!hasNextPage && { cursor: nextCursor }),
        });
        hasNextPage = resp.hasNextPage;
        nextCursor = resp.nextCursor;
        data = resp.data;
        allData.push(...data);
      }

      console.log(allData);
      setData(
        allData.map(({ data: { objectId, type, version } }: any) => {
          const parts = type.split("::");
          return {
            objectId,
            packageId: parts[0],
            moduleName: parts[1],
            structName: parts[2],
            version,
          } as GeneralSuiObject;
        })
      );
      setIsLoading(false);
      setIsError(false);
    } catch (err) {
      console.log(err);
      setData([]);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return {
    data,
    isLoading,
    isError,
    reFetchData,
  };
};
