/* eslint-disable @typescript-eslint/no-explicit-any */
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export function useThumbs(mainApi: any, options: any) {
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    ...options,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onClickThumb = useCallback(
    (index: any) => {
      if (!mainApi || !thumbsApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbsApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbsApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  return {
    onClickThumb,
    thumbsRef,
    thumbsApi,
    selectedIndex,
  };
}
