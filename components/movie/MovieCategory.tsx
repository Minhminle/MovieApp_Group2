// Import các thành phần cần thiết từ Material-UI
import React from "react";
import { Box, Typography, Button } from "@mui/material";

// Định nghĩa một component sử dụng TypeScript
const MovieCategory: React.FC = () => {
  return (
    <Box>
      {/* Sử dụng Box để tạo một container */}
      <Box bgcolor="primary.main" color="primary.contrastText" p={2}>
        {/* Sử dụng Typography để hiển thị văn bản */}
        <Typography variant="h4">
          Chào mừng bạn đến với ứng dụng của chúng tôi!
        </Typography>
      </Box>

      {/* Sử dụng một Box khác để tạo khoảng cách */}
      <Box m={2} />

      {/* Sử dụng Box và Button để tạo một nút */}
      <Box>
        <Button variant="contained" color="primary">
          Nhấn vào đây
        </Button>
      </Box>
    </Box>
  );
};

export default MovieCategory;
