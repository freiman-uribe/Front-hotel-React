import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditHotel from "./components/pages/EditHotel";
import ListHotel from "./components/pages/LlistHotel";
import AccommodationPage from "./components/pages/AccommodationPage";
import RoomTypePage from "./components/pages/RoomTypePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListHotel />} />
        <Route path="/hotel/:hotelId" element={<EditHotel />} />
        <Route
          path="/accommodations/:hotelId"
          element={<AccommodationPage />}
        />
        <Route path="/room-types/:hotelId" element={<RoomTypePage />} />
      </Routes>
    </Router>
  );
}

export default App;
