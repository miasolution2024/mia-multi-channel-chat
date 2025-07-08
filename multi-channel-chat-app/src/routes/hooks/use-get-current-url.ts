import { usePathname, useSearchParams } from "next/navigation";

export default function useGetCurrentUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return `${pathname}${
    searchParams?.toString() ? `?${searchParams.toString()}` : ""
  }`;
}
