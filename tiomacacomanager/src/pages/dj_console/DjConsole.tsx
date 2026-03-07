import { Box, Container, Grid, Paper, Stack, Typography, Card, CardMedia, CardContent, CardActionArea} from "@mui/material";
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

  const selectSong = (sr: SongRequest) => {
    // link opening handled by 'a' 
    setSongqueue((sq) => sq.filter((i) => i.requestid != sr.requestid))
    songrequestService.delete_song_request(sr)
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
    <Container maxWidth="xl" sx={{ height: "100vh", py: 4 }}>
      <Typography variant="h3" fontWeight="800" gutterBottom>
        Consola DJ
      </Typography>

      <Paper 
        elevation={4} 
        sx={{ 
          height: "85%", 
          p: 3, 
          borderRadius: 4, 
          bgcolor: "#fdfdfd",
          display: "flex" 
        }}
      >
        <Grid container spacing={4} sx={{ flex: 1 }}>
          
          {/* Left Side: Song Queue */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
              Próximas Canciones
            </Typography>

            <Stack 
              spacing={3} 
              sx={{ 
                flex: 1, 
                overflowY: "auto", 
                pr: 2,
                maxHeight: "calc(100vh - 250px)" // Critical for scrolling to work
              }}
            >
              {songqueue.map((song,index) => (
                <Card
                  key={song.requestid}
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse", 
                    minHeight: 150, // This fixes the "too short" issue
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #eee"
                  }}
                >
                { index==0? (<CardActionArea
                    onClick={() => selectSong(song)}
                    component="a"
                    href={song.vid_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse", // Keeps thumbnail on the right
                      alignItems: "stretch",        // Makes content/image same height
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 260,
                        objectFit: "cover",
                      }}
                      image={song.song_thumbnail}
                      alt={song.songname}
                    />

                    <CardContent sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {song.songname}
                      </Typography>
                      
                      {/* Stylized Divider Bar */}
                      <Box sx={{ width: 60, height: 5, bgcolor: "secondary.main", borderRadius: 2, mb: 2 }} />

                      <Typography variant="body1" color="text.secondary">
                        Solicitado por: <strong>{song.sender}</strong>
                      </Typography>
                    </CardContent>
                  </CardActionArea>):(
                    <>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 260, // Wider image for a professional look
                        objectFit: "cover",
                      }}
                      image={song.song_thumbnail}
                      alt={song.songname}
                    />

                    <CardContent sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {song.songname}
                      </Typography>
                      
                      {/* Stylized Divider Bar */}
                      <Box sx={{ width: 60, height: 5, bgcolor: "secondary.main", borderRadius: 2, mb: 2 }} />

                      <Typography variant="body1" color="text.secondary">
                        Solicitado por: <strong>{song.sender}</strong>
                      </Typography>
                    </CardContent>
                    </>
                  )
                  }
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Right Side: QR Code Area */}
          <Grid size={{ xs: 0, md: 6 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #eee" }}>
            <Typography variant="h5" textAlign="center" fontWeight="700" gutterBottom>
              ¿Quieres otra?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Escanea para pedir una canción
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: "white", borderRadius: 4, boxShadow: 2 }}>
              <QRCode 
                value={`http://${window.location.host}/song_request`} 
                size={240} 
              />
            </Box>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
}