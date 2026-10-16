import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import HomePage from "./pages/HomePage/HomePage";
import AuctionPage from "./pages/AuctionPage/AuctionPage";
import CreateAuctionPage from "./pages/CreateAuctionPage/CreateAuctionPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auctions/new" element={<RequireAuth><CreateAuctionPage /></RequireAuth>} />
          <Route path="/auctions/:id" element={<AuctionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<h1>Sidan finns inte</h1>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;