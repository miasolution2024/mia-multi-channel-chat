import { JwtSignUpView } from "@/auth/view/sign-up-view";
import { CONFIG } from "@/config-global";

export const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignUpView />;
}
