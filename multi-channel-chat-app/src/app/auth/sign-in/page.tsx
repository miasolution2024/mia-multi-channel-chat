// ----------------------------------------------------------------------

import { JwtSignInView } from "@/auth/view/sign-in-view";
import { CONFIG } from "@/config-global";

export const metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignInView />;
}
