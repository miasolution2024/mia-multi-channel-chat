/* eslint-disable @typescript-eslint/no-explicit-any */
import COLORS from "../core/colors.json";
import PRIMARY_COLOR from "./primary-color.json";
import { components as coreComponents } from "../core/components";
import { hexToRgbChannel, createPaletteChannel } from "../styles";
import {
  primary as corePrimary,
  grey as coreGreyPalette,
} from "../core/palette";
import {
  createShadowColor,
  customShadows as coreCustomShadows,
} from "../core/custom-shadows";

// ----------------------------------------------------------------------

const PRIMARY_COLORS: any = {
  default: COLORS.primary,
  cyan: PRIMARY_COLOR.cyan,
  purple: PRIMARY_COLOR.purple,
  blue: PRIMARY_COLOR.blue,
  orange: PRIMARY_COLOR.orange,
  red: PRIMARY_COLOR.red,
};

// ----------------------------------------------------------------------

/**
 * [1] settings @primaryColor
 * [2] settings @contrast
 */

export function updateCoreWithSettings(theme: any, settings: any) {
  const { colorSchemes, customShadows } = theme;

  const updatedPrimary = getPalette(
    settings.primaryColor,
    corePrimary,
    PRIMARY_COLORS[settings.primaryColor]
  );

  return {
    ...theme,
    colorSchemes: {
      ...colorSchemes,
      light: {
        palette: {
          ...colorSchemes?.light?.palette,
          /** [1] */
          primary: updatedPrimary,
          /** [2] */
          background: {
            ...colorSchemes?.light?.palette?.background,
            default: getBackgroundDefault(settings.contrast),
            defaultChannel: hexToRgbChannel(
              getBackgroundDefault(settings.contrast)
            ),
          },
        },
      },
      dark: {
        palette: {
          ...colorSchemes?.dark?.palette,
          /** [1] */
          primary: updatedPrimary,
        },
      },
    },
    customShadows: {
      ...customShadows,
      /** [1] */
      primary:
        settings.primaryColor === "default"
          ? coreCustomShadows("light").primary
          : createShadowColor(updatedPrimary.mainChannel),
    },
  };
}

// ----------------------------------------------------------------------

export function updateComponentsWithSettings(settings: any) {
  const components: any = {};

  /** [2] */
  if (settings.contrast === "hight") {
    const MuiCard = {
      styleOverrides: {
        root: ({ theme, ownerState }: any) => {
          let rootStyles = {};
          if (
            typeof coreComponents?.MuiCard?.styleOverrides?.root === "function"
          ) {
            rootStyles =
              coreComponents.MuiCard.styleOverrides.root({
                ownerState,
                theme,
              }) ?? {};
          }

          return {
            ...rootStyles,
            boxShadow: theme.customShadows.z1,
          };
        },
      },
    };

    components.MuiCard = MuiCard;
  }

  return { components };
}

// ----------------------------------------------------------------------

function getPalette(name: string, initialPalette: any, updatedPalette: any) {
  /** [1] */
  return name === "default"
    ? initialPalette
    : createPaletteChannel(updatedPalette);
}

function getBackgroundDefault(contrast: any) {
  /** [2] */
  return contrast === "default" ? "#FFFFFF" : coreGreyPalette[200];
}
