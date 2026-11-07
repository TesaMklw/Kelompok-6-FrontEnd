export const akunPelanggan = {
	peran: "pelanggan",
	username: "pelanggan",
	password: "pelanggan123",
	nama: "Pelanggan",
	email: "pelanggan@gmail.com",
	telepon: "081234567890",
	alamat: "Jl. Mawar No. 8, Desa Sukamaju",
};

export const akunAdmin = {
	peran: "admin",
	username: "admin",
	password: "123456",
	nama: "Admin Warung",
	email: "admin@warungwongdeso.id",
	telepon: "082122517112",
	alamat: "Warung Wong Deso",
};

const daftarAkun = [akunPelanggan, akunAdmin];

export function cariAkun(username, password) {
	const nama = username.trim();
	return daftarAkun.find(
		(akun) => akun.username === nama && akun.password === password,
	);
}
