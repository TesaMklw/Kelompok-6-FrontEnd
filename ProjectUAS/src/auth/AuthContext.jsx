import { createContext, useContext, useMemo, useState } from "react";
import { cariAkun } from "../data/akun";

const KUNCI_SESI = "warung-wong-deso-sesi";
const AuthContext = createContext(null);

function bacaSesi() {
	if (typeof window === "undefined") return null;
	try {
		const mentah = window.localStorage.getItem(KUNCI_SESI);
		return mentah ? JSON.parse(mentah) : null;
	} catch {
		return null;
	}
}

function tanpaSandi(akun) {
	const sesi = { ...akun };
	delete sesi.password;
	return sesi;
}

export function AuthProvider({ children }) {
	const [pengguna, setPengguna] = useState(bacaSesi);

	const nilai = useMemo(() => {
		function masuk(username, password) {
			const akun = cariAkun(username, password);
			if (!akun) {
				return { ok: false, pesan: "Username atau password salah." };
			}

			const sesi = tanpaSandi(akun);
			window.localStorage.setItem(KUNCI_SESI, JSON.stringify(sesi));
			window.localStorage.removeItem("warung-wong-deso-admin-login");
			setPengguna(sesi);
			return { ok: true, pengguna: sesi };
		}

		function keluar() {
			window.localStorage.removeItem(KUNCI_SESI);
			window.localStorage.removeItem("warung-wong-deso-admin-login");
			setPengguna(null);
		}

		return { pengguna, masuk, keluar };
	}, [pengguna]);

	return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const konteks = useContext(AuthContext);
	if (!konteks) {
		throw new Error("useAuth harus dipakai di dalam AuthProvider.");
	}
	return konteks;
}
