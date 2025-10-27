import { FacebookReaction } from "../type";

export function sumAllEmotions(reactionData: FacebookReaction): number {
  if (!reactionData || !reactionData.data || reactionData.data.length === 0) {
    return 0;
  }

  let total = 0;
  reactionData.data.forEach((dataItem) => {
    if (dataItem.values && dataItem.values.length > 0) {
      dataItem.values.forEach((valueItem) => {
        if (valueItem.value && typeof valueItem.value === "object") {
          total +=
            (valueItem.value.like || 0) +
            (valueItem.value.love || 0) +
            (valueItem.value.wow || 0) +
            (valueItem.value.haha || 0) +
            (valueItem.value.sorry || 0) +
            (valueItem.value.anger || 0);
        }
      });
    }
  });

  return total;
}
