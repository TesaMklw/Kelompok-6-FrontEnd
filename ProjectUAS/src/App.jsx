import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import TataLetak from "./components/TataLetak";
import Admin from "./halaman/Admin";
import Beranda from "./halaman/Beranda";
import Galeri from "./halaman/Galeri";
import Masuk from "./halaman/Masuk";
import Menu from "./halaman/Menu";
import Profil from "./halaman/Profil";
import Tentang from "./halaman/Tentang";
import Ulasan from "./halaman/Ulasan";

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<TataLetak />}>
						<Route index element={<Beranda />} />
						<Route path="galeri" element={<Galeri />} />
						<Route path="menu" element={<Menu />} />
						<Route path="ulasan" element={<Ulasan />} />
						<Route path="tentang" element={<Tentang />} />
						<Route path="profil" element={<Profil />} />
						<Route path="masuk" element={<Masuk />} />
						<Route path="admin" element={<Admin />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}