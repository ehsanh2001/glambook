import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: "2px dashed #3f51b5", // Default color in MUI theme
  borderRadius: "8px",
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
  maxWidth: "300px",
  height: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const ImageUploader = ({ image, setImage, imageFileName }) => {
  const [thumbnailImage, setThumbnailImage] = useState(null);

  React.useEffect(() => {
    if (image) {
      setThumbnailImage(URL.createObjectURL(image));
    }
  }, [image]);

  React.useEffect(() => {
    if (imageFileName) {
      setThumbnailImage(`/api/image/${imageFileName}`);
    }
  }, [imageFileName]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith("image/")) return;

    // Set image for business data
    setImage(file);

    // Set thumbnail image for preview
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <DropzoneContainer
      {...getRootProps()}
      sx={{
        backgroundImage: thumbnailImage ? `url(${thumbnailImage})` : "none",
      }}
    >
      <input {...getInputProps()} />
      {!image && (
        <Typography variant="body1">
          Drag 'n' drop an image here, or click to select one
        </Typography>
      )}
    </DropzoneContainer>
  );
};

export default ImageUploader;
