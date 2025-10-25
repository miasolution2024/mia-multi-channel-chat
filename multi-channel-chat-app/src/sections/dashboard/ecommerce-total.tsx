import { Iconify } from "@/components/iconify";
import { Box, Card, Typography } from "@mui/material";
import React from "react";

const TotalTypes = [
  {
    id: 1,
    type: "comments",
    title: "Lượt bình luận",
    icon: "bxs:comment",
    color: "#F0B94B",
    bgColor: "#FEF9EE",
  },
  {
    id: 2,
    type: "shares",
    title: "Lượt chia sẻ",
    icon: "ph:share-fat-fill",
    color: "#2373D3",
    bgColor: "#F2F7FD",
  },
  {
    id: 3,
    type: "converts",
    title: "Lượt chuyển đổi",
    icon: "proicons:person-2",
    color: "#7F55E0",
    bgColor: "#F5F2FD",
  },
];

interface EcommerceTotalProps {
  type: string;
}

const EcommerceTotal: React.FC<EcommerceTotalProps> = ({ type }) => {
  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "155px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box
          sx={{
            padding: "17px 24px 19px",
          }}
        >
          {TotalTypes.filter((item) => item.type === type)?.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "100%",
                  padding: "6px",
                  backgroundColor: item.bgColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                }}
              >
                <Iconify icon={item.icon} style={{ color: item.color }} />
              </Box>

              <Box
                sx={{
                  marginLeft: "16px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Public Sans Variable",
                    color: "#9095A1",
                    fontSize: "16px",
                    lineHeight: "26px",
                    fontWeight: "500px",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Box>
          ))}

          <Typography
            sx={{
              my: "8px",
              color: "#323743",
              fontFamily: "Public Sans Variable",
              fontSize: "32px",
              lineHeight: "48px",
              fontWeight: 700,
            }}
          >
            0
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Iconify
                icon={"mdi:arrow-up"}
                width="12"
                height="12"
                style={{ color: "#1AC052" }}
              />
              <Typography
                sx={{
                  marginLeft: "4px",
                  fontSize: "12px",
                  fontFamily: "Public Sans Variable",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#1AC052",
                }}
              >
                0%
              </Typography>
            </Box>

            <Typography
              sx={{
                marginLeft: "4px",
                fontSize: "12px",
                fontFamily: "Public Sans Variable",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#323743",
              }}
            >
              so với kỳ trước
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default EcommerceTotal;
