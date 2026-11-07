import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Kaki from "./Kaki";
import Navigasi from "./Navigasi";

export default function TataLetak() {
	const { pathname, hash } = useLocation();
	const { pengguna } = useAuth();
	const panelAdmin = pathname === "/admin" && pengguna?.peran === "admin";

	useEffect(() => {
		if (hash) {
			const bagian = document.querySelector(hash);
			if (bagian) {
				bagian.scrollIntoView({ behavior: "smooth", block: "start" });
				return;
			}
		}
		window.scrollTo(0, 0);
	}, [pathname, hash]);

	return (
		<>
			{!panelAdmin && <Navigasi />}
			<main className="isi-halaman">
				<Outlet />
			</main>
			<Kaki />
		</>
	);
}

