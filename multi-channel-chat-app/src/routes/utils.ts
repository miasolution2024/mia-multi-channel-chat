/* eslint-disable @typescript-eslint/no-unused-vars */
// ----------------------------------------------------------------------

export const hasParams = (url: string | Record<string, unknown> | ((...args: unknown[]) => unknown) | null | undefined) => {
  // Nếu url là một object (ví dụ: function), trả về false
  if (typeof url === 'object' && url !== null && typeof url !== 'string') {
    return false;
  }
  
  // Nếu url là function, trả về false
  if (typeof url === 'function') {
    return false;
  }
  
  // Nếu url là string, xử lý như trước
  if (typeof url === 'string') {
    const queryString = url?.split("?")[1];
    return queryString
      ? new URLSearchParams(queryString).toString().length > 0
      : false;
  }
  
  return false;
};

// ----------------------------------------------------------------------

export function removeLastSlash(pathname: string | Record<string, unknown> | ((...args: unknown[]) => unknown) | unknown) {
  /**
   * Remove last slash
   * [1]
   * @input  = '/dashboard/calendar/'
   * @output = '/dashboard/calendar'
   * [2]
   * @input  = '/dashboard/calendar'
   * @output = '/dashboard/calendar'
   */
  // Nếu pathname không phải string, trả về pathname hoặc chuỗi rỗng
  if (typeof pathname !== 'string') {
    return typeof pathname === 'undefined' ? '/' : '/';
  }
  
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

// ----------------------------------------------------------------------

export function removeParams(url: string | Record<string, unknown> | ((...args: unknown[]) => unknown) | unknown) {
  // Nếu url là một object (ví dụ: function), trả về url
  if (typeof url === 'object' && url !== null && typeof url !== 'string') {
    return '';
  }
  
  // Nếu url là function, trả về chuỗi rỗng
  if (typeof url === 'function') {
    return '';
  }
  
  // Nếu url là string, xử lý như trước
  if (typeof url === 'string') {
    try {
      const urlObj = new URL(url, window.location.origin);
      return removeLastSlash(urlObj.pathname);
    } catch (error) {
      return url;
    }
  }
  
  return '';
}

// ----------------------------------------------------------------------

export function isExternalLink(url: string | Record<string, unknown> | ((...args: unknown[]) => unknown) | unknown) {
  // Nếu url là một object hoặc không phải string, trả về false
  if (typeof url !== 'string') {
    return false;
  }
  
  return url.startsWith("http");
}
