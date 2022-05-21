import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BasicModal(props: Props) {
  const { isOpen, onConfirm, onCancel } = props;
  return (
    <Modal
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Please confirm that you want to delete the book.
        </Typography>

        <Grid container direction="row">
          <Grid item container xs={6}>
            <Button color="secondary" variant="contained" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>

          <Grid item container xs={6} justifyContent="end">
            <Button color="primary" variant="contained" onClick={onConfirm}>
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
