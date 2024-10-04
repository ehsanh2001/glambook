import * as React from "react";
import { TextField, Stack, Box } from "@mui/material";
import ImageUploader from "../BusinessDashbordCmp/GeneralBusinessInfoForm/ImageUploader";

export default function StaffGeneralInfoForm({ staff, setStaff }) {
  const handleStaffChange = (e) => {
    setBusiness({ ...staff, [e.target.id]: e.target.value });
  };

  const handleImageChange = (image) => {
    setStaff({ ...staff, staffImageData: image, staffImageFileName: null });
  };

  return (
    <Stack spacing={3}>
      {/* staff image */}

      <ImageUploader
        imageFileName={staff.staffImageFileName || null}
        image={staff.staffImageData || null}
        setImage={handleImageChange}
      />
      {/* staff name */}
      <TextField
        id="staffName"
        label="Name"
        variant="standard"
        autoComplete="off"
        sx={{ marginBottom: 2, width: "60ch" }}
        value={staff.staffName}
        onChange={handleStaffChange}
      />
    </Stack>
  );
}
