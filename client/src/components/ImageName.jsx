import { Avatar, Box, Typography } from "@mui/material";

export default function ImageName({ image, name, align }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack image and name vertically
        alignItems: { align }, // Center image and name
      }}
    >
      <Avatar
        src={image ? `/api/image/${image}` : ""}
        alt={name}
        sx={{
          width: 50, // adjust size
          height: 50,
          borderRadius: "50%", // circular border
        }}
      />
      <Typography
        variant="body2"
        sx={{
          marginTop: 1,
        }} // add space between image and name
      >
        {name}
      </Typography>
    </Box>
  );
}
