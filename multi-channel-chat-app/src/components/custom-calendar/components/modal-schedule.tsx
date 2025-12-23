import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";
import { formatToDDMMYYYY } from "../hooks/use-format-date-time";
import { updateWorkingSchedulePost } from "@/actions/schedule-post-calendar";
import { mutate } from "swr";

interface ModalScheduleProps {
  isOpened: boolean;
  handleCloseSchedule: () => void;
  workingId: string;
  workingTitle: string;
  dateCreated: Date | null;
  timeCreated: string;
}

const ModalSchedule: React.FC<ModalScheduleProps> = ({
  isOpened,
  handleCloseSchedule,
  workingId,
  workingTitle,
  dateCreated,
  timeCreated,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);
  const [warning, setWarning] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const getMinDateTime = () => {
    return dayjs();
  };

  useEffect(() => {
    if (isOpened) {
      const now = dayjs();
      let initialDateTime = now;

      if (dateCreated) {
        const created = dayjs(dateCreated)
          .set("hour", parseInt(timeCreated.split(":")[0]))
          .set("minute", parseInt(timeCreated.split(":")[1]));
        initialDateTime = created.isAfter(now) ? created : now;
      }

      setSelectedDateTime(initialDateTime);
      setWarning("");
      setSubmitError("");
    }
  }, [isOpened, dateCreated, timeCreated]);

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setSelectedDateTime(newValue);
    setWarning("");

    if (!newValue) return;

    const now = dayjs();
    if (newValue.isBefore(now)) {
      setWarning("Thời gian đăng bài không được trước thời gian hiện tại");
    }
  };

  const handleSubmit = async () => {
    if (warning || isSubmitting || !selectedDateTime) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const scheduleDateTime = selectedDateTime.format("YYYY-MM-DD HH:mm:ss");

      await updateWorkingSchedulePost(workingId, scheduleDateTime);

      setWarning("");

      mutate(
        (key) =>
          typeof key === "string" &&
          key.includes("/items/ai_content_suggestions"),
        undefined,
        { revalidate: true }
      );

      handleCloseSchedule();
    } catch (error) {
      console.error("Error updating schedule:", error);
      setSubmitError(
        "Có lỗi xảy ra khi cập nhật lịch đăng bài. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (event?: React.MouseEvent) => {
    if (isSubmitting) return;
    event?.preventDefault();
    event?.stopPropagation();
    handleCloseSchedule();
  };

  return (
    <>
      <Dialog
        open={isOpened}
        onClose={() => handleCancel()}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={isSubmitting}
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Chọn thời gian đăng bài
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                fontWeight: "medium",
                fontFamily: "Public Sans Variable",
              }}
            >
              {workingTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ngày tạo: {formatToDDMMYYYY(dateCreated)} - {timeCreated}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian đăng bài"
                value={selectedDateTime}
                onChange={handleDateTimeChange}
                minDateTime={getMinDateTime()}
                format="DD/MM/YYYY HH:mm"
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            {warning && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {warning}
              </Alert>
            )}

            {submitError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {submitError}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancel}
            color="inherit"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!!warning || isSubmitting || !selectedDateTime}
          >
            {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalSchedule;
