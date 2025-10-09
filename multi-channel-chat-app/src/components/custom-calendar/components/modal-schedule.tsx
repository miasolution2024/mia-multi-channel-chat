import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { formatToDDMMYYYY } from "../hooks/use-format-date-time";
import { updateWorkingSchedulePost } from "@/actions/post-calendar";
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeWarning, setTimeWarning] = useState<string>("");
  const [dateWarning, setDateWarning] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  const getMinDate = () => {
    if (!dateCreated) return today;
    const dateCreatedStr = new Date(dateCreated).toISOString().split("T")[0];
    return dateCreatedStr >= today ? dateCreatedStr : today;
  };

  useEffect(() => {
    if (isOpened) {
      const initialDate =
        dateCreated && new Date(dateCreated) >= new Date(today)
          ? new Date(dateCreated).toISOString().split("T")[0]
          : today;

      setSelectedDate(initialDate);

      const isDateCreatedTodayOrLater =
        dateCreated && new Date(dateCreated) >= new Date(today);
      if (isDateCreatedTodayOrLater) {
        setSelectedTime(timeCreated);
      } else {
        const now = new Date();
        const currentTime = now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setSelectedTime(currentTime);
      }

      setTimeWarning("");
      setDateWarning("");
      setSubmitError("");
    }
  }, [isOpened, dateCreated, timeCreated, today]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);

    setTimeWarning("");
    setDateWarning("");

    if (newDate < today) {
      setDateWarning("Ngày không được trước ngày hôm nay");
      return;
    }

    if (dateCreated) {
      const dateCreatedStr = new Date(dateCreated).toISOString().split("T")[0];
      if (newDate < dateCreatedStr) {
        setDateWarning("Ngày không được trước ngày tạo bài viết");
        return;
      }
    }

    if (
      dateCreated &&
      new Date(dateCreated).toISOString().split("T")[0] === newDate
    ) {
      setSelectedTime(timeCreated);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);

    // Only apply time validation if the selected date is today
    if (selectedDate === today) {
      if (
        dateCreated &&
        new Date(dateCreated).toISOString().split("T")[0] === selectedDate
      ) {
        const [newHour, newMinute] = newTime.split(":").map(Number);
        const [createdHour, createdMinute] = timeCreated.split(":").map(Number);

        const newTimeMinutes = newHour * 60 + newMinute;
        const createdTimeMinutes = createdHour * 60 + createdMinute;

        if (newTimeMinutes < createdTimeMinutes) {
          setTimeWarning("Thời gian không được trước thời gian tạo bài viết");
        } else {
          setTimeWarning("");
        }
      } else {
        setTimeWarning("");
      }
    } else {
      setTimeWarning("");
    }
  };

  const handleSubmit = async () => {
    if (timeWarning || dateWarning || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const scheduleDateTime = `${selectedDate} ${selectedTime}:00`;

      await updateWorkingSchedulePost(workingId, scheduleDateTime);

      setTimeWarning("");
      setDateWarning("");

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
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
              {workingTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ngày tạo: {formatToDDMMYYYY(dateCreated)} - {timeCreated}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Ngày đăng bài"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              inputProps={{
                min: getMinDate(),
              }}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Thời gian đăng bài"
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            {dateWarning && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {dateWarning}
              </Alert>
            )}

            {timeWarning && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {timeWarning}
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
            disabled={!!timeWarning || !!dateWarning || isSubmitting}
          >
            {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalSchedule;
