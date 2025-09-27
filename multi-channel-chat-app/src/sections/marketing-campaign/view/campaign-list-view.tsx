"use client";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { Button, Card, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export function CampaignListView() {
  const router = useRouter();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chiến dịch Marketing"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Chiến dịch Marketing",
            href: paths.dashboard.marketingCampaign,
          },
          { name: "Danh sách" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.marketingCampaign.new)}
          >
            Thêm nội dung mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Stack
          direction={"row"}
          sx={{ p: 2.5 }}
          spacing={2}
          justifyContent={"space-between"}
        ></Stack>
      </Card>
    </DashboardContent>
  );
}
