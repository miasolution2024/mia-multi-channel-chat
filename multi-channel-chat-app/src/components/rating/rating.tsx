/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rating as MuiRatting, styled } from "@mui/material";

export const Rating = styled(MuiRatting)(({ theme }: any) => ({
  "& .MuiRating-iconFilled": {
    color: theme.vars.palette.primary.main,
  },
  "& .MuiRating-iconHover": {
    color: theme.vars.palette.primary.dark,
  },
}));
