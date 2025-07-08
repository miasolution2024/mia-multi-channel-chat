/* eslint-disable @typescript-eslint/no-explicit-any */

import { flattenArray } from "@/utils/helper";

// ----------------------------------------------------------------------

export function getAllItems({ data }: any) {
  const reduceItems = data
    .map((list: any) => handleLoop(list.items, list.subheader))
    .flat();

  const items = flattenArray(reduceItems).map((option: any) => {
    const group = splitPath(reduceItems, option.path);

    return {
      group: group && group.length > 1 ? group[0] : option.subheader,
      title: option.title,
      path: option.path,
    };
  });

  return items;
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, query }: any) {
  if (query) {
    inputData = inputData.filter(
      (item: any) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function splitPath(array: any, key: any) {
  let stack = array.map((item: any) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop();

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item: any) => ({
          path: path.concat(item.title),
          currItem: item,
        }))
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function handleLoop(array: any, subheader: any) {
  return array?.map((list: any) => ({
    subheader,
    ...list,
    ...(list.children && { children: handleLoop(list.children, subheader) }),
  }));
}

export function groupItems(array: any) {
  const group = array.reduce((groups: any, item: any) => {
    groups[item.group] = groups[item.group] || [];

    groups[item.group].push(item);

    return groups;
  }, {});

  return group;
}
