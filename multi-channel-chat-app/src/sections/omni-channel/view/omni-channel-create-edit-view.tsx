"use client";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { OmniChannelNewEditForm } from "../omni-channel-new-edit-form";
import { OmniChannel } from "@/models/omni-channel/omni-channel";

// ----------------------------------------------------------------------

export function OmniChannelCreateEditView({
  currentOmniChannel,
}: {
  currentOmniChannel?: OmniChannel;
}) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new channel"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Omni Channels", href: paths.dashboard.omniChannels.root },
          { name: "New channel" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <OmniChannelNewEditForm currentOmniChannel={currentOmniChannel} />
    </DashboardContent>
  );
}
