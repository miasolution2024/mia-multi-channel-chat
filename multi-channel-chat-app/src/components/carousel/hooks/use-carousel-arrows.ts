/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export const useCarouselArrows = (mainApi: any) => {
  const [disablePrev, setDisabledPrevBtn] = useState(true);

  const [disableNext, setDisabledNextBtn] = useState(true);

  const onClickPrev = useCallback(() => {
    if (!mainApi) return;
    mainApi.scrollPrev();
  }, [mainApi]);

  const onClickNext = useCallback(() => {
    if (!mainApi) return;
    mainApi.scrollNext();
  }, [mainApi]);

  const onSelect = useCallback((_mainApi: any) => {
    setDisabledPrevBtn(!_mainApi.canScrollPrev());
    setDisabledNextBtn(!_mainApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!mainApi) return;

    onSelect(mainApi);
    mainApi.on("reInit", onSelect);
    mainApi.on("select", onSelect);
  }, [mainApi, onSelect]);

  return {
    disablePrev,
    disableNext,
    onClickPrev,
    onClickNext,
  };
};
