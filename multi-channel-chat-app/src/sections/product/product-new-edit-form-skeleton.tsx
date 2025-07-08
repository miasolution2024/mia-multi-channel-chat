// src/sections/product/product-new-edit-form-skeleton.tsx
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import CardHeader from "@mui/material/CardHeader";

// ----------------------------------------------------------------------

export function ProductNewEditFormSkeleton() {
  const renderDetails = (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width={100} height={20} />}
        subheader={<Skeleton variant="text" width={200} height={15} />}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={118} />
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width={120} height={20} />}
        subheader={<Skeleton variant="text" width={220} height={15} />}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        >
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="rounded" width="100%" height={56} />
          ))}
        </Box>
        <Skeleton variant="rounded" width="100%" height={56} />
        <Divider sx={{ borderStyle: "dashed" }} />
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width={80} height={20} />}
        subheader={<Skeleton variant="text" width={180} height={15} />}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack direction="row" justifyContent="flex-end">
      <Skeleton variant="rounded" width={140} height={48} />
    </Stack>
  );

  return (
    <Stack width={1}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: "auto", width: { xs: 720, xl: 880 } }}
      >
        {renderDetails}
        {renderProperties}
        {renderPricing}
        {renderActions}
      </Stack>
    </Stack>
  );
}
