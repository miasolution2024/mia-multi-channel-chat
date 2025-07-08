/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

export const isValidURL = (string: string) => {
  return string.indexOf("http") !== -1;
};

// ----------------------------------------------------------------------

export const getProductIdFromAmazonURL = (url: string) => {
  try {
    const urlObj = new URL(url);

    // Case 1:  For URLs like: /dp/B08XYZ1234
    const asinAfterDp = urlObj.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1];
    if (asinAfterDp) return asinAfterDp;

    // Case 2: For URLs like: /gp/product/B08XYZ1234
    const asinAfterProduct = urlObj.pathname.match(
      /\/gp\/product\/([A-Z0-9]{10})/
    )?.[1];
    if (asinAfterProduct) return asinAfterProduct;

    // Case 3: For URLs with query parameters like: /.../ref=...&psc=1&smid=...&asin=B08XYZ1234
    const asinInSearchParam = urlObj.searchParams.get("asin");
    if (asinInSearchParam) return asinInSearchParam;

    // Case 4:  For URLs with query parameters like: /.../ref=...&pd_rd_i=B08XYZ1234&...
    const pd_rd_i = urlObj.searchParams.get("pd_rd_i");
    if (pd_rd_i) return pd_rd_i;

    throw new Error("Could not extract ASIN");
  } catch (error) {
    console.error("Error parsing URL:", error);
    return "";
  }
};

// ----------------------------------------------------------------------

export const isAmazonProductDetailPageLink = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Check for /dp/ or /gp/product/ which usually indicates a product page
    if (pathname.includes("/dp/") || pathname.includes("/gp/product/")) {
      return url.indexOf("amazon.com") !== -1 && true;
    }

    // Alternative check, less reliable, but can sometimes catch product pages
    // that don't follow the /dp/ convention.  Checks for a 10-character alphanumeric ASIN.
    const asinRegex = /[A-Z0-9]{10}/;
    if (asinRegex.test(pathname))
      return url.indexOf("amazon.com") !== -1 && true;

    return false;
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
};

// ----------------------------------------------------------------------

export const isWalmartDetailPageLink = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Walmart product URLs often contain /ip/ or /p/ followed by a number
    // or sometimes /product/
    const productRegex1 = /\/ip\//;
    const productRegex2 = /\/p\//;
    const productRegex3 = /\/product\//;

    if (
      productRegex1.test(pathname) ||
      productRegex2.test(pathname) ||
      productRegex3.test(pathname)
    ) {
      return url.indexOf("walmart.com") !== -1 && true;
    }

    return false;
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
};

// ----------------------------------------------------------------------

export const getWalmartProductIdFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);

    // Case 1:  For URLs like: /ip/123456789
    const productIdAfterIp = urlObj.pathname.match(/\/ip\/([0-9]+)/);
    if (productIdAfterIp) return productIdAfterIp[1];

    // Case 2: For URLs with query parameters like: /.../?product_id=11223344
    const productIdInSearchParam = urlObj.searchParams.get("product_id");
    if (productIdInSearchParam) return productIdInSearchParam;

    // Case 3.For URLs like: /ip/Beautiful-6by.../597932797
    const productIdMatch = urlObj.pathname.match(/\/ip\/[^\/]+\/(\d+)/);
    if (productIdMatch) return productIdMatch[1];
    throw new Error("Could not extract ASIN");
  } catch (error) {
    console.error("Error parsing URL:", error);
    return "";
  }
};
/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

// ----------------------------------------------------------------------

export function flattenArray(list: any, key = "children"): any {
  let children: any = [];

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(
    children.length ? flattenArray(children, key) : children
  );
}

// ----------------------------------------------------------------------

export function flattenDeep(array: any) {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity);
  }
  return [];
}

// ----------------------------------------------------------------------

export function orderBy(array: any, properties: any, orders: any) {
  return array.slice().sort((a: any, b: any) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === "desc" ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function keyBy(array: any, key: any) {
  return (array || []).reduce((result: any, item: any) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {});
}

// ----------------------------------------------------------------------

export function sumBy(array: any, iteratee: any) {
  return array.reduce((sum: any, item: any) => sum + iteratee(item), 0);
}

// ----------------------------------------------------------------------

export function isEqual(a: any, b: any): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (
    typeof a === "string" ||
    typeof a === "number" ||
    typeof a === "boolean"
  ) {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export const merge = (target: any, ...sources: any): any => {
  if (!sources.length) return target;

  const source = sources.shift();

  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
};

export function stringAvatar(name: string) {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export const generateCode = (numChars: number) => {
  let numbers = "";
  for (let i = 0; i < numChars; i += 1) {
    numbers += Math.floor(Math.random() * 10);
  }
  return numbers;
};
