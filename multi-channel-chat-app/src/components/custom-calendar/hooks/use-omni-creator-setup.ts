import { useState, useEffect } from "react";
import { OmniChoices, CreatorsChoices, UserInfo } from "../type";

interface UseOmniCreatorSetupProps {
  uniqueUsers?: UserInfo[];
  omniChoices?: OmniChoices[];
}

export function useOmniCreatorSetup({
  uniqueUsers = [],
  omniChoices = [],
}: UseOmniCreatorSetupProps = {}) {
  const [omniChannels, setOmniChannels] = useState<OmniChoices[]>([
    { id: 0, page_name: "Tất cả", ai_content_suggestions: [] },
  ]);
  const [creators, setCreators] = useState<CreatorsChoices[]>([
    { id: "0", user_name: "Tất cả", ai_content_suggestions: [] },
  ]);
  // const { omniChannelsData } = useGetWorkingScheduleOmniChannels();
  // const omniChannelsLength = Array.isArray(omniChannelsData)
  //   ? omniChannelsData.length
  const omniChannelsLength = Array.isArray(omniChoices)
    ? omniChoices.length
    : 0;

  const userInfoLength = Array.isArray(uniqueUsers) ? uniqueUsers.length : 0;

  useEffect(() => {
    // if (omniChannelsData) {
    //   const apiOmni: OmniChoices[] = omniChannelsData.map((item) => ({
    if (omniChoices && Array.isArray(omniChoices)) {
      const apiOmni: OmniChoices[] = omniChoices.map((item) => ({
        id: item.id,
        page_name: item.page_name,
        ai_content_suggestions: item.ai_content_suggestions,
      }));

      const allOmniChannels: OmniChoices[] = [
        { id: 0, page_name: "Tất cả", ai_content_suggestions: [] },
        ...apiOmni,
      ];
      setOmniChannels(allOmniChannels);
    }
    // }, [omniChannelsData, omniChannelsLength]);
  }, [omniChoices, omniChannelsLength]);

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
    if (uniqueUsers && Array.isArray(uniqueUsers) && uniqueUsers.length > 0) {
      const apiUserInfo: CreatorsChoices[] = uniqueUsers
        .filter((item) => item && item.id != null)
        .map((item) => ({
          id: item.id,
          user_name:
            item.full_name ||
            `${item.first_name || ""} ${item.last_name || ""}`.trim(),
          ai_content_suggestions: [],
        }));

      const allUserInfoChannels: CreatorsChoices[] = [
        { id: "0", user_name: "Tất cả", ai_content_suggestions: [] },
        ...apiUserInfo,
      ];
      setCreators(allUserInfoChannels);
    }
  }, [uniqueUsers, userInfoLength]);

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
