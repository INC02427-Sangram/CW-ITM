import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Backdrop } from '@mui/material';

const FINAL_COUNTDOWN_TIME = 60; // Countdown from 60 seconds

function SessionTimeoutWarningModal({ show, onLogout, onContinue }) {
  const [countdown, setCountdown] = useState(FINAL_COUNTDOWN_TIME);

  // This effect is ONLY responsible for the timer that updates the display.
  useEffect(() => {
    let countdownInterval;
    if (show) {
      setCountdown(FINAL_COUNTDOWN_TIME);
      countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      clearInterval(countdownInterval);
    };
  }, [show]);

  useEffect(() => {
    if (countdown <= 0) {
      onLogout();
    }
  }, [countdown, onLogout]);

  return (
    <>
      <Backdrop
        open={show}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff',
        }}
      />
      <Dialog
        open={show}
        disableEscapeKeyDown
        aria-labelledby="session-timeout-dialog-title"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <DialogTitle id="session-timeout-dialog-title">
          Session Timeout Warning
        </DialogTitle>
        <DialogContent>
          <Typography>
            You have been inactive and will be logged out in{' '}
            <Typography component="span" fontWeight="bold" color="error">
              {countdown}
            </Typography>{' '}
            seconds.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onContinue} variant="contained" sx={{textTransform:'none !important'}}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SessionTimeoutWarningModal;