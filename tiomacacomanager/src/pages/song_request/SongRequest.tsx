import {
  Container,
  TextField,
  Typography,
  Stack,
  Button,
  Paper,
  Alert,
  Dialog,
  Box,
  Snackbar
} from "@mui/material"
import { useState } from "react"
import type { SongRequest } from "../../model/SongRequest"
import { useNavigate } from "react-router-dom"

import {SongRequestService} from "../../services/SongRequestService"

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/

  const match = url.match(regex)
  return match ? match[1] : null
}

function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}

function getThumbnail(url: string): string | null {
  const id = extractYouTubeId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

const songrequestService = new SongRequestService();

export  function SongRequest() {


  const [songrequest, setSongrequest] = useState<SongRequest>({
    request_time: "",
    sender: "",
    songname: "",
    vid_url: "",
    song_thumbnail:""
  })

  const [errors, setErrors] = useState({
    vid_url: false,
    unspecified: true
  })

  const navigator = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setSongrequest(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === "vid_url") {
      setErrors(prev => ({
        ...prev,
        vid_url: value.length > 0 && !isValidYouTubeUrl(value)
      }))
    }
  }

  const handleSubmit = () => {
    const hasVideoError =
      !isValidYouTubeUrl(songrequest.vid_url)

    setErrors(prev => ({...prev, vid_url: hasVideoError }))

    if (hasVideoError) return
    const rawThumbnail = getThumbnail(songrequest.vid_url)
    const extracted_thumbnail = rawThumbnail ?? ""


    const songrequest_with_thumbnail = ({...songrequest,song_thumbnail:extracted_thumbnail})

    songrequestService
    .new_song_request(songrequest_with_thumbnail)
    .then((r) => {

    navigator("/song_ok",{state:{...songrequest,song_thumbnail:extracted_thumbnail}})
    setSongrequest({
      request_time:"",
      sender: "",
      songname: "",
      vid_url: "",
      song_thumbnail:""
    })
    })
    .catch((e) => {
      setErrors(prev => ({...prev, unspecified: hasVideoError }))
      console.error(e)
    })
  }

  const thumbnail = getThumbnail(songrequest.vid_url)

  const isFormValid =
    songrequest.sender &&
    songrequest.songname &&
    isValidYouTubeUrl(songrequest.vid_url)

  return (
    <>
      <Snackbar
        open={errors.unspecified}
        autoHideDuration={1000} // Snackbar auto-dismisses after 3 seconds
        onClose={()=>{setErrors(prev => ({...prev,unspecified:false}))}}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={errors.unspecified ? "error" : "success"} // Display "error" severity if vid_url is invalid
          onClose={()=>{setErrors(prev => ({...prev,unspecified:false}))}}
          sx={{ width: "100%" }}
        >
          Ocurrio un error no especificado
        </Alert>
      </Snackbar>

    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center">
            Propón tu canción
          </Typography>

          <TextField
            name="sender"
            label="Tu Nombre"
            value={songrequest.sender}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="songname"
            label="Nombre de tu canción"
            value={songrequest.songname}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="vid_url"
            label="Link de Youtube"
            value={songrequest.vid_url}
            onChange={handleChange}
            error={errors.vid_url}
            helperText={
              errors.vid_url
                ? "Link incorrecto"
                : ""
            }
            fullWidth
          />

          {thumbnail && (
            <img
              src={thumbnail}
              alt="YouTube thumbnail"
              style={{
                width: "100%",
                borderRadius: 8
              }}
            />
          )}

          {!isFormValid && (
            <Alert severity="info">
              Completa todos los campos con un link de youtube valido
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Listo!
          </Button>
        </Stack>
      </Paper>
    </Container>
    </>
  )
}
