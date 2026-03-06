import { Box, Container, Grid, Paper, Stack, Typography, Card, CardMedia, CardContent} from "@mui/material";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import type { SongRequest } from "../../model/SongRequest";
import { SongRequestService } from "../../services/SongRequestService";

const songrequestService = new SongRequestService();

export default function DjConsole() {
  const [songqueue, setSongqueue] =  useState<SongRequest[]>([])


  const addNewSong = (sr: SongRequest) => {
    console.log("Song Request at newsong",sr)
    setSongqueue((sq) => [...sq,sr])
  }

  //Debug
  useEffect(() => {
    console.log("Queue updated to:", songqueue);
  }, [songqueue]);

  useEffect(() => {
    songrequestService.startWebSocket()
    songrequestService.onNewSongRequest(addNewSong)
    songrequestService.get_song_requests()
    .then((lst) => setSongqueue(lst))
  },[])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Consola DJ
      </Typography>
      <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Cola
            </Typography>
            <Stack spacing={2}>
              {songqueue.map((song) => (
                <Card
                  key={song.requestid}
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse", // image on the right
                    boxShadow: 2,
                    "&:hover": { boxShadow: 4 },
                    transition: "all 0.3s"
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 160,
                      aspectRatio: "16 / 9",
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0
                    }}
                    image={song.song_thumbnail}
                    alt={song.songname}
                  />

                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "left"
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {song.songname}
                      </Typography>

                      {/* Bar under title */}
                      <Box
                        sx={{
                          height: 2,
                          width: 40,
                          bgcolor: "primary.main",
                          my: 1,
                          borderRadius: 1
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}   // proper MUI grey
                      >
                        Solicitado por: {song.sender}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                Escanea para pedir una cancion
              </Typography>
              <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
                <QRCode value={
                  `http://${window.location.host}/song_request`
                } size={256} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}