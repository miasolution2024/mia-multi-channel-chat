import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import { POST_TYPE_OPTIONS } from "@/constants/auto-post";
import type { Content } from "./view/content-assistant-list-view";
import { CONFIG } from "@/config-global";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

interface MediaItem {
  id?: number;
  ai_content_suggestions_id?: number;
  directus_files_id: string;
}

interface ContentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  content: Content | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export function ContentDetailDialog({
  open,
  onClose,
  content,
}: ContentDetailDialogProps) {
  const [tabValue, setTabValue] = useState(0);

  if (!content) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Chi tiết nội dung
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Tìm hiểu" />
          <Tab label="Dàn ý" />
          <Tab label="Nội dung" />
          <Tab label="HTML" />
        </Tabs>
      </Box>

      <DialogContent>
        {/* Tab 1: Tìm hiểu (Research) */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Chi tiết bài viết</Typography>
            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Chủ đề
                </Typography>
                <Typography>{content.topic}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại bài viết
                </Typography>
                <Typography>
                  {POST_TYPE_OPTIONS.find(
                    (option) => option.value === content.post_type
                  )?.label || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Từ khoá chính
                </Typography>
                <Typography>{content.main_seo_keyword}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Từ khoá phụ
                </Typography>
                {content.secondary_seo_keywords &&
                content.secondary_seo_keywords.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {content.secondary_seo_keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Không có dữ liệu
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Thông tin khách hàng
            </Typography>
            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nhóm khách hàng
                </Typography>
                {content.customer_group && content.customer_group.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {content.customer_group.map((group, index) => (
                      <Chip
                        key={index}
                        label={group?.customer_group_id?.name || "N/A"}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Không có dữ liệu
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Giai đoạn khách hàng
                </Typography>
                {content.customer_journey &&
                content.customer_journey.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {content.customer_journey.map((journey, index) => (
                      <Chip
                        key={index}
                        label={journey?.customer_journey_id?.name}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Không có dữ liệu
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Dịch vụ
                </Typography>
                {content.services && content.services.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {content.services.map((service, index) => (
                      <Chip
                        key={index}
                        label={service?.services_id?.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Không có dữ liệu
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Văn phong AI
            </Typography>
            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Tông điệu
              </Typography>
              {content.content_tone && content.content_tone.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    maxHeight: 200,
                    overflowY: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  {content.content_tone.map((tone, index) => (
                    <Chip
                      key={index}
                      label={tone?.content_tone_id?.tone_description || "N/A"}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          padding: "8px",
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Không có dữ liệu
                </Typography>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Quy tắc AI
              </Typography>
              {content.ai_rule_based && content.ai_rule_based.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    maxHeight: 200,
                    overflowY: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  {content.ai_rule_based.map((rule, index) => (
                    <Chip
                      key={index}
                      label={rule?.ai_rule_based_id?.content}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: "auto",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          padding: "8px",
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Không có dữ liệu
                </Typography>
              )}
            </Box>

            {content.video && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Video
                </Typography>
                <video
                  src={`${CONFIG.serverUrl}/assets/${content.video}`}
                  controls
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab 2: Dàn ý (Outline) */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mục tiêu bài viết
                </Typography>
                <Typography>
                  {content.post_goal || "Chưa có thông tin"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Lưu ý bài viết
                </Typography>
                <Typography>
                  {content.post_notes || "Chưa có thông tin"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Dàn ý bài viết
                </Typography>
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                    bgcolor: "background.neutral",
                  }}
                >
                  {content.outline_post ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: String(content.outline_post),
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary" fontStyle="italic">
                      Chưa có dàn ý
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 3: Nội dung (Content) */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Nội dung bài viết</Typography>
            <Divider />

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                bgcolor: "background.neutral",
                minHeight: 300,
              }}
            >
              {content?.post_content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: String(content.post_content),
                  }}
                />
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Chưa có nội dung
                </Typography>
              )}
            </Box>

            {content.media_generated_ai &&
              content.media_generated_ai.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Hình ảnh đã tạo sinh ({content.media_generated_ai.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {content.media_generated_ai?.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          component="img"
                          src={`${CONFIG.serverUrl}/assets/${item?.directus_files_id}`}
                          alt={`Generated ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

            {content.media && content.media.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Hình ảnh được đính kèm ({content.media.length})
                </Typography>
                <Grid container spacing={2}>
                  {content.media?.map((item, index) => {
                    // Handle both File object and API response format
                    let imageSrc = "";
                    if (typeof item === "string") {
                      imageSrc = `${CONFIG.serverUrl}/assets/${item}`;
                    } else if (item instanceof File) {
                      imageSrc = URL.createObjectURL(item);
                    } else if (
                      item &&
                      typeof item === "object" &&
                      "directus_files_id" in item
                    ) {
                      imageSrc = `${CONFIG.serverUrl}/assets/${
                        (item as MediaItem).directus_files_id
                      }`;
                    }

                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          component="img"
                          src={imageSrc}
                          alt={`Media ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab 4: HTML */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Format HTML</Typography>
            <Divider />

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                bgcolor: "background.neutral",
                minHeight: 300,
              }}
            >
              {content.post_html_format ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: String(content.post_html_format),
                  }}
                />
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Chưa có HTML format
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
