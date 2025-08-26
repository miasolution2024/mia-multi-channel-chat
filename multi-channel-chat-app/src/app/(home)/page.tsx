// ----------------------------------------------------------------------
import { redirect } from "next/navigation";
import { CONFIG } from "@/config-global";

export const metadata = { title: `Home | - ${CONFIG.appName}` };

export default function Page() {
  redirect("/dashboard/content-assistant");
}
