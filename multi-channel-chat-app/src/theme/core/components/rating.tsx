/* eslint-disable @typescript-eslint/no-explicit-any */
import { ratingClasses } from "@mui/material/Rating";
import SvgIcon, { svgIconClasses } from "@mui/material/SvgIcon";

// ----------------------------------------------------------------------

/**
 * Icons
 */
export const RatingIcon = (props: any) => (
  <SvgIcon {...props}>
    <path
      d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
      fill="currentColor"
    />
  </SvgIcon>
);

// ----------------------------------------------------------------------

const MuiRating = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { [`&.${ratingClasses.disabled}`]: { opacity: 0.48 } },
    iconEmpty: {
      color: "#D9D9D9",
    },
    iconFilled: {
      color: "#EC2028",
    },
    sizeSmall: { [`& .${svgIconClasses.root}`]: { width: 20, height: 20 } },
    sizeMedium: { [`& .${svgIconClasses.root}`]: { width: 24, height: 24 } },
    sizeLarge: { [`& .${svgIconClasses.root}`]: { width: 28, height: 28 } },
  },
  defaultProps: {
    icon: <RatingIcon />,
    emptyIcon: <RatingIcon />,
  },
};

// ----------------------------------------------------------------------

export const rating = { MuiRating };
