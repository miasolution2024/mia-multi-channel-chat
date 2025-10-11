import { Iconify } from "@/components/iconify";
import {
  Box,
  Typography,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { CreatorsChoices } from "../type";

interface DrawerDropdownCreatorProps {
  title: string;
  handleDataToggle: (id: string) => void;
  data: CreatorsChoices[];
  dataChoices: string[];
}

const DrawerDropdownCreator: React.FC<DrawerDropdownCreatorProps> = ({
  title,
  handleDataToggle,
  data,
  dataChoices,
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarVisibility = () => {
    setOpenSidebar(!openSidebar);
  };
  return (
    <>
      <Box
        sx={{
          mt: 3,
          boxShadow: "0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F",
          borderRadius: "6px",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          p: 1,
        }}
      >
        <Box
          sx={{
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: "16px",
              fontFamily: "Public Sans Variable",
              color: "#171A1F",
            }}
          >
            {title}
          </Typography>

          <Button
            onClick={handleSidebarVisibility}
            sx={{
              flexShrink: 0,
              backgroundColor: "transparent",
              width: 44,
              height: 44,
              minWidth: 0,
              p: 0,
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#EAECF0",
                "&:active": {
                  backgroundColor: "#DEE1E6",
                },
              },
              "&:disabled": {
                opacity: 0.4,
              },
            }}
          >
            <Iconify
              icon="iconamoon:arrow-up-2"
              sx={{
                color: "#9095A1",
                transform: `${openSidebar ? "rotate(180deg)" : "rotate(0deg)"}`,
                transition: "transform 0.3s ease-in-out",
              }}
              width={20}
              height={20}
            />
          </Button>
        </Box>

        <Box
          sx={{
            maxHeight: openSidebar ? "1000px" : "0px",
            overflow: "hidden",
            transition: "all 0.35s ease-in-out",
          }}
        >
          <List sx={{ p: 0 }}>
            {data.map((data) => (
              <ListItem
                key={data.id}
                sx={{
                  cursor: "pointer",
                }}
              >
                <Box sx={{ minWidth: "auto", mr: 0 }}>
                  <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    onClick={() => handleDataToggle(data.id)}
                    checked={dataChoices.includes(data.id)}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Box>
                <ListItemText
                  id={data.id?.toString() || ""}
                  primary={data.user_name}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default DrawerDropdownCreator;
