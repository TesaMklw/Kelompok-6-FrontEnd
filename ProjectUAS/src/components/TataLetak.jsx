import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Kaki from "./Kaki";
import Navigasi from "./Navigasi";

export default function TataLetak() {
	const { pathname, hash } = useLocation();

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
			<Navigasi />
			<main className="isi-halaman">
				<Outlet />
			</main>
			<Kaki />
		</>
	);
}

