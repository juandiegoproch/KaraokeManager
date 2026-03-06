import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'

import { SongRequest } from "./pages/song_request/SongRequest.tsx"
import { SongOk } from './pages/song_proposed_correctly/song_ok.tsx'
import DjConsole from './pages/dj_console/DjConsole.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/song_request" replace />} />
      <Route path="/song_request" element={<SongRequest />} />
      <Route path="/song_ok" element={<SongOk />} />
      <Route path="/dj_console" element={<DjConsole />} />
    </Routes>
  )
}

export default App
