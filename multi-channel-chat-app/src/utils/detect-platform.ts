export function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  return {
    isAndroid,
    isIOS: isIOS,
    //   isMobile: isAndroid || isIOS,
  };
}
