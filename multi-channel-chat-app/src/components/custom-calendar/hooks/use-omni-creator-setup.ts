/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetWorkingScheduleOmniChannels,
  useGetWorkingScheduleUsernames,
} from "@/actions/schedule-post-calendar";
import { useState, useEffect } from "react";
import { OmniChoices, CreatorsChoices } from "../type";

export function useOmniCreatorSetup() {
  const [omniChannels, setOmniChannels] = useState<OmniChoices[]>([
    { id: 0, page_name: "Tất cả" },
  ]);
  const [creators, setCreators] = useState<CreatorsChoices[]>([
    { id: "0", user_name: "Tất cả" },
  ]);
  const { omniChannelsData } = useGetWorkingScheduleOmniChannels();
  const { userInfoData, userInfoToFullName } = useGetWorkingScheduleUsernames();
  const omniChannelsLength = Array.isArray(omniChannelsData)
    ? omniChannelsData.length
    : 0;

  const userInfoLength = Array.isArray(userInfoData) ? userInfoData.length : 0;

  useEffect(() => {
    if (omniChannelsData) {
      const apiOmni: OmniChoices[] = omniChannelsData.map((item) => ({
        id: item.id,
        page_name: item.page_name,
      }));

      const allOmniChannels: OmniChoices[] = [
        { id: 0, page_name: "Tất cả" },
        ...apiOmni,
      ];
      setOmniChannels(allOmniChannels);
    }
  }, [omniChannelsData, omniChannelsLength]);

  const createToggleHandlerOmni = (
    setChoices: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    return (id: number) => {
      setChoices((prev) => {
        if (id === 0) {
          if (prev.includes(0)) {
            return [];
          } else {
            return [0];
          }
        } else {
          if (prev.includes(id)) {
            const newSelection = prev.filter((selectedId) => selectedId !== id);
            return newSelection.length === 0 ? [] : newSelection;
          } else {
            const newSelection = prev.filter((selectedId) => selectedId !== 0);
            return [...newSelection, id];
          }
        }
      });
    };
  };

  useEffect(() => {
    if (userInfoData && userInfoToFullName && Array.isArray(userInfoData)) {
      const apiUserInfo: CreatorsChoices[] = userInfoData
        .filter((item: any) => item && item.id != null)
        .map((item: any) => ({
          id: item.id,
          user_name: userInfoToFullName.get(item.id) || "",
        }));

      const allUserInfoChannels: CreatorsChoices[] = [
        { id: "0", user_name: "Tất cả" },
        ...apiUserInfo,
      ];
      setCreators(allUserInfoChannels);
    }
  }, [userInfoData, userInfoLength, userInfoToFullName]);

  const createToggleHandleCreator = (
    setChoices: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    return (id: string) => {
      setChoices((prev) => {
        if (id === "0") {
          if (prev.includes("0")) {
            return [];
          } else {
            return ["0"];
          }
        } else {
          if (prev.includes(id)) {
            const newSelection = prev.filter((selectedId) => selectedId !== id);
            return newSelection.length === 0 ? [] : newSelection;
          } else {
            const newSelection = prev.filter(
              (selectedId) => selectedId !== "0"
            );
            return [...newSelection, id];
          }
        }
      });
    };
  };
  return {
    createToggleHandlerOmni,
    createToggleHandleCreator,
    omniChannels,
    creators,
  };
}
