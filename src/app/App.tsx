import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import ReportTicket from './routes/ReportTicket'
import MyReports from './routes/MyReports'
import TicketDetail from './routes/TicketDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ReportTicket />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="ticket/:id" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
