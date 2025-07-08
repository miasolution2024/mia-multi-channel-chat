/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { fileThumbnailClasses } from "./classes";
import { fileData, fileThumb, fileFormat } from "./utils";
import { RemoveButton, DownloadButton } from "./action-buttons";
import { Lightbox, useLightBox } from "../lightbox";

// ----------------------------------------------------------------------

export function FileThumbnail({
  sx,
  file,
  tooltip,
  onRemove,
  imageView,
  slotProps,
  onDownload,
  className,
  ...other
}: any) {
  const previewUrl =
    typeof file === "string" ? file : URL.createObjectURL(file);
  const slides = [
    {
      src: previewUrl,
    },
  ];

  const lightbox = useLightBox(slides);

  const { name, path } = fileData(file);

  const format = fileFormat(path || previewUrl);

  const renderImg = (
    <Box
      component="img"
      src={previewUrl}
      className={fileThumbnailClasses.img}
      onClick={() => lightbox.onOpen(previewUrl)}
      sx={{
        cursor: "zoom-in",
        width: 1,
        height: 1,
        objectFit: "cover",
        borderRadius: "inherit",
        ...slotProps?.img,
      }}
    />
  );

  const renderIcon = (
    <Box
      component="img"
      src={fileThumb(format)}
      className={fileThumbnailClasses.icon}
      sx={{ width: 1, height: 1, ...slotProps?.icon }}
    />
  );

  const renderContent = (
    <Box
      component="span"
      className={fileThumbnailClasses.root.concat(
        className ? ` ${className}` : ""
      )}
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 1.25,
        alignItems: "center",
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      {imageView ? renderImg : renderIcon}

      {onRemove && (
        <RemoveButton
          onClick={onRemove}
          className={fileThumbnailClasses.removeBtn}
          sx={slotProps?.removeBtn}
        />
      )}

      {onDownload && (
        <DownloadButton
          onClick={onDownload}
          className={fileThumbnailClasses.downloadBtn}
          sx={slotProps?.downloadBtn}
        />
      )}

      <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        slides={slides}
        index={lightbox.selected}
      />
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip
        arrow
        title={name}
        slotProps={{
          popper: {
            modifiers: [{ name: "offset", options: { offset: [0, -12] } }],
          },
        }}
      >
        {renderContent}
      </Tooltip>
    );
  }

  return renderContent;
}
