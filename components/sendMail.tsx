import React, { useRef, FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DoneIcon from "@mui/icons-material/Done";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [emailContent, setEmailContent] = useState({
    from_email: "",
    message: "",
  });
  const [showError, setShowError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!emailContent.from_email || !emailContent.message) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (form.current) {
      emailjs
        .sendForm("service_zp6qpot", "template_m64wheo", form.current, {
          publicKey: "JY-2T6msnc3sdPdD8",
        })
        .then(
          () => {
            console.log("SUCCESS!");
            setSnackbarOpen(true);
            setEmailContent({ from_email: "", message: "" });
          },
          (error) => {
            console.log("FAILED...", error.text);
          }
        );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));

    // Đặt phần kiểm tra trong cùng một tập dấu ngoặc nhọn của hàm handleInputChange
    if (
      (name === "from_email" && emailContent.message && showError) ||
      (name === "message" && emailContent.from_email && showError)
    ) {
      setShowError(false);
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <Stack justifyContent="center">
        <Box>
          <Typography
            sx={{
              fontSize: "18px",
              color: "gray",
              fontStyle: "italic",
              textAlign: "justify",
            }}
          >
            Send us feedback if you have anything to reflect on the website. We
            will contact you as soon as possible to address your requests
          </Typography>
          <TextField
            label="Email address *"
            type="email"
            name="from_email"
            variant="outlined"
            color={showError && !emailContent.from_email ? "error" : "success"}
            fullWidth
            margin="normal"
            value={emailContent.from_email}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            placeholder="user@example.com"
            focused
          />
          <TextField
            label="Message *"
            name="message"
            variant="outlined"
            color={showError && !emailContent.message ? "error" : "success"}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={emailContent.message}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            placeholder="Enter your message here..."
            focused
          />
        </Box>
        {showError && (
          <Typography variant="body2" color="error">
            Please fill out both email and message fields.
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="warning"
          sx={{
            width: "25%",
            borderRadius: "20px",
          }}
        >
          Send
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          style={{ background: "green" }}
        >
          <SnackbarContent
            message={
              <Stack direction="row" alignItems="center">
                <DoneIcon sx={{ marginRight: 1 }} />
                Email sent successfully!
              </Stack>
            }
            sx={{
              backgroundColor: "green",
              color: "black",
            }}
          />
        </Snackbar>
      </Stack>
    </form>
  );
};
