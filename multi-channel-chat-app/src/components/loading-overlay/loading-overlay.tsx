import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  showProgress?: boolean;
};

export function LoadingOverlay({
  open,
  title = "Đang xử lý...",
  description = "Quá trình này có thể mất 1-2 phút. Vui lòng không tắt trình duyệt.",
  showProgress = true,
}: Props) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          p: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minWidth: 320,
        }}
      >
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>

          {showProgress && (
            <LinearProgress
              sx={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#fff",
                  borderRadius: 3,
                },
              }}
            />
          )}

          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              mt: 2,
              display: "block",
            }}
          >
            Quá trình này có thể mất 1-2 phút. Vui lòng không tắt trình duyệt.
          </Typography>
        </Box>
      </Box>
    </Backdrop>
  );
}