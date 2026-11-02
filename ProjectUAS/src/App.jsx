import { BrowserRouter, Route, Routes } from "react-router-dom";
import TataLetak from "./components/TataLetak";
import Beranda from "./halaman/Beranda";
import Galeri from "./halaman/Galeri";
import Menu from "./halaman/Menu";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TataLetak />}>
          <Route index element={<Beranda />} />
          <Route path="galeri" element={<Galeri />} />
          <Route path="menu" element={<Menu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
