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
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <Stack justifyContent="center">
        <Box>
          <TextField
            label="Email"
            type="email"
            name="from_email"
            variant="outlined"
            color="success"
            fullWidth
            margin="normal"
            value={emailContent.from_email}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            focused
          />
          <TextField
            label="Message"
            name="message"
            variant="outlined"
            color="success"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={emailContent.message}
            onChange={handleInputChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            focused
          />
        </Box>
        {showError && (
          <Typography variant="body2" color="error">
            Please fill out both email and message fields.
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          style={{ background: "yellow" }}
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
