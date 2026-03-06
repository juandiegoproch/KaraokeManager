import { useLocation, useNavigate } from "react-router-dom"
import { Stack, Typography, Paper, Box } from "@mui/material"
import type { SongRequest } from "../../model/SongRequest"

export function SongOk() {
  const location = useLocation()
  const navigate = useNavigate()

  const approvedSongRequest =
    location.state as SongRequest | undefined

  if (!approvedSongRequest) {
    navigate("/") // or show fallback UI
    return null
  }

  return (
    <Stack spacing={3} sx={{ mt: 6 }}>
      <Typography variant="h5" align="center">
        Tu canción se ha añadido a la cola!
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          {approvedSongRequest.songname}
        </Typography>


        <Box
        component="img"
        src={approvedSongRequest.song_thumbnail}
        alt="Song thumbnail"
        sx={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 2,
            mx: "auto",
            display: "block"
        }}
        />
      </Paper>
    </Stack>
  )
}
