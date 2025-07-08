import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

export function ScanQRCodeView() {
  return (
    <Box>
      <Card>
        <CardHeader />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6", // Equivalent of bg-gray-200
              borderRadius: "0.5rem", // Equivalent of rounded-lg
              marginBottom: "1.5rem", // Equivalent of mb-6
              border: "2px dashed #d1d5db", // Equivalent of border-2 border-dashed border-gray-400
            }}
          ></Box>


          <Button fullWidth color="primary" size="large" variant="contained">
            Confirm Order
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
