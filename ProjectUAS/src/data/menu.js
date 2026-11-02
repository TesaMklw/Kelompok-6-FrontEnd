export function formatRupiah(nilai) {
	return `Rp ${nilai.toLocaleString("id-ID")}`;
}

export const kelompokMenu = [
	{
		nama: "Menu Utama",
		item: [
			{
				id: "nila-goreng-bakar",
				nama: "Ikan Nila Saja",
				keterangan: "Nila Goreng / Bakar, sambal, lalapan",
				harga: 25000,
			},
			{
				id: "nasi-nila-goreng-bakar",
				nama: "Nasi + Ikan Nila",
				keterangan: "Nasi Uduk / Biasa, Nila Goreng / Bakar, sambal, lalapan",
				harga: 30000,
			},
			{
				id: "ayam-kremes",
				nama: "Ayam Kremes",
				keterangan: "Ayam ungkep, kremes, sambal, lalapan",
				harga: 17000,
			},
			{
				id: "nasi-ayam-kremes",
				nama: "Nasi + Ayam Kremes",
				keterangan: "Nasi Uduk / Biasa, ayam kremes, sambal, lalapan",
				harga: 22000,
			},
			{
				id: "ayam-bakar",
				nama: "Ayam Bakar",
				keterangan: "Ayam bakar, sambal, lalapan",
				harga: 17000,
			},
			{
				id: "nasi-ayam-bakar",
				nama: "Nasi + Ayam Bakar",
				keterangan: "Nasi Uduk / Biasa, ayam bakar, sambal, lalapan",
				harga: 22000,
			},
			{
				id: "lele-goreng-bakar",
				nama: "Ikan Lele Saja",
				keterangan: "Lele goreng / bakar, sambal, lalapan",
				harga: 13000,
			},
			{
				id: "nasi-lele-bakar",
				nama: "Nasi + Ikan Lele",
				keterangan: "Nasi Uduk / Biasa, Lele goreng / bakar, sambal, lalapan",
				harga: 18000,
			},
			{
				id: "bebek-goreng-bakar",
				nama: "Bebek Saja",
				keterangan: "Bebek goreng / bakar, sambal, lalapan",
				harga: 30000,
			},
			{
				id: "nasi-bebek-goreng-bakar",
				nama: "Nasi + Bebek",
				keterangan: "Nasi Uduk / Biasa, Bebek goreng / bakar, sambal, lalapan",
				harga: 35000,
			},
			{
				id: "nasi-goreng-biasa",
				nama: "Nasi Goreng Biasa",
				keterangan: "",
				harga: 15000,
			},
			{
				id: "nasi-goreng-ayam",
				nama: "Nasi Goreng Ayam",
				keterangan: "",
				harga: 20000,
			},
			{
				id: "nasi-goreng-spesial",
				nama: "Nasi Goreng Spesial",
				keterangan: "",
				harga: 25000,
			},
			{
				id: "nasi-goreng-gila",
				nama: "Nasi Goreng Gila",
				keterangan: "",
				harga: 20000,
			},
			{
				id: "nasi-gila",
				nama: "Nasi Gila",
				keterangan: "",
				harga: 15000,
			},
			{
				id: "mie-goreng-biasa",
				nama: "Mie Goreng Biasa",
				keterangan: "",
				harga: 15000,
			},
			{
				id: "mie-goreng-ayam",
				nama: "Mie Goreng Ayam",
				keterangan: "",
				harga: 18000,
			},
			{
				id: "bihun-goreng-kuah",
				nama: "Bihun",
				keterangan: "Bihun Goreng / Kuah",
				harga: 15000,
			},
			{
				id: "kwetiau-goreng-kuah",
				nama: "Kwetiau",
				keterangan: "Kwetiau Goreng / Kuah",
				harga: 15000,
			},
			{
				id: "soto-ayam",
				nama: "Soto Ayam",
				keterangan: "Kuah bening, ayam suwir, nasi",
				harga: 15000,
			},
			{
				id: "cap-cay",
				nama: "Cap Cay",
				keterangan: "Aneka sayur, ayam, bakso",
				harga: 15000,
			},
		],
	},
	{
		nama: "Lauk Tambahan",
		item: [
			{
				id: "tempe-tahu",
				nama: "Tempe / Tahu",
				keterangan: "Tempe tipis / tahu lembut",
				harga: 2000,
			},
			{
				id: "sate-kulit-ayam",
				nama: "Sate Kulit Ayam",
				keterangan: "",
				harga: 3000,
			},
			{
				id: "sate-ati-ampela-ayam",
				nama: "Sate Ati Ampela Ayam",
				keterangan: "",
				harga: 5000,
			},
			{
				id: "kepala-bebek",
				nama: "Kepala Bebek",
				keterangan: "",
				harga: 7000,
			},
			{
				id: "nasi-putih-uduk",
				nama: "Nasi",
				keterangan: "Nasi Putih / Uduk",
				harga: 5000,
			},
		],
	},
	{
		nama: "Minuman",
		item: [
			{
				id: "teh-manis",
				nama: "Teh Manis",
				keterangan: "Teh Manis (hangat / es)",
				harga: 5000,
			},
			{
				id: "kopi-hangat",
				nama: "Kopi Hangat",
				keterangan: "",
				harga: 5000,
			},
			{
				id: "jeruk",
				nama: "Jeruk",
				keterangan: "Jeruk (hangat / es)",
				harga: 5000,
			},
		],
	},
];

export function cariMenu(id) {
	for (const kelompok of kelompokMenu) {
		const ditemukan = kelompok.item.find((item) => item.id === id);
		if (ditemukan) return ditemukan;
	}
	return null;
}

