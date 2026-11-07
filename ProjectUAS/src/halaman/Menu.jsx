import { useEffect, useMemo, useRef, useState } from "react";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { cariMenu, formatRupiah, kelompokMenu } from "../data/menu";

const awalPelanggan = {
	nama: "",
	telepon: "",
	alamat: "",
	catatan: "",
};

function dataPelanggan(pengguna) {
	if (pengguna?.peran !== "pelanggan") return awalPelanggan;
	return {
		nama: pengguna.nama,
		telepon: pengguna.telepon,
		alamat: pengguna.alamat,
		catatan: "",
	};
}

const metodeBayar = [
	{ nilai: "tunai", label: "Tunai" },
	{ nilai: "transfer", label: "Transfer" },
	{ nilai: "qris", label: "QRIS" },
];

const daftarMenu = kelompokMenu.flatMap((kelompok) =>
	kelompok.item.map((item) => ({ ...item, kategori: kelompok.nama })),
);
const ADMIN_STORAGE_KEY = "warung-wong-deso-admin";

function teksCari(item) {
	return `${item.nama} ${item.keterangan} ${item.kategori}`.toLowerCase();
}

function simpanPesananKeAdmin(pelanggan, pesanan) {
	if (typeof window === "undefined") return;

	try {
		const stored = JSON.parse(window.localStorage.getItem(ADMIN_STORAGE_KEY) ?? "{\"menu\":[],\"orders\":[]}");
		const orderText = pesanan.map((item) => `${item.nama} x${item.jumlah}`).join(", ");
		const nextOrder = {
			id: `WD-${Date.now()}`,
			nama: pelanggan.nama,
			menu: orderText,
			total: pesanan.reduce((jumlah, item) => jumlah + item.harga * item.jumlah, 0),
			status: "Menunggu",
		};

		window.localStorage.setItem(
			ADMIN_STORAGE_KEY,
			JSON.stringify({
				menu: Array.isArray(stored.menu) ? stored.menu : [],
				orders: [...(Array.isArray(stored.orders) ? stored.orders : []), nextOrder],
			}),
		);
	} catch {
		// Abaikan bila penyimpanan lokal tidak tersedia.
	}
}

export default function Menu() {
	const { pengguna } = useAuth();
	const bolehPesan = pengguna?.peran === "pelanggan";
	const [keranjang, setKeranjang] = useState([]);
	const [pelanggan, setPelanggan] = useState(() => dataPelanggan(pengguna));
	const [cari, setCari] = useState("");
	const [urutan, setUrutan] = useState("bawaan");
	const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
	const [metode, setMetode] = useState("");
	const [berhasil, setBerhasil] = useState(false);
	const sudahBayar = useRef(false);

	const kunciAkun = pengguna?.peran === "pelanggan" ? pengguna.username : "";
	const [akunForm, setAkunForm] = useState(kunciAkun);

	if (kunciAkun !== akunForm) {
		setAkunForm(kunciAkun);
		setPelanggan(dataPelanggan(pengguna));
		if (!kunciAkun) setKeranjang([]);
	}

	useEffect(() => {
		document.title = "Warung Wong Deso - Menu";
	}, []);

	const kata = cari.trim().toLowerCase();
	const sedangMenyusun = urutan !== "bawaan" || kata.length > 0;

	const tampilan = useMemo(() => {
		const daftar = daftarMenu.map((item) => ({ ...item, cocok: false }));
		if (urutan === "termurah") {
			daftar.sort(
				(a, b) => a.harga - b.harga || a.nama.localeCompare(b.nama, "id"),
			);
		}
		if (urutan === "termahal") {
			daftar.sort(
				(a, b) => b.harga - a.harga || a.nama.localeCompare(b.nama, "id"),
			);
		}
		if (!kata) return daftar;

		const cocok = [];
		const lain = [];
		for (const item of daftar) {
			if (teksCari(item).includes(kata)) cocok.push({ ...item, cocok: true });
			else lain.push(item);
		}
		return [...cocok, ...lain];
	}, [kata, urutan]);

	const pesanan = keranjang
		.map((item) => {
			const menu = cariMenu(item.id);
			if (!menu) return null;
			return { ...menu, jumlah: item.jumlah };
		})
		.filter(Boolean);

	const total = pesanan.reduce(
		(jumlah, item) => jumlah + item.harga * item.jumlah,
		0,
	);

	function ubahPelanggan(event) {
		const { name, value } = event.target;
		setPelanggan((sekarang) => ({ ...sekarang, [name]: value }));
	}

	function tambah(id) {
		if (!bolehPesan) return;
		setBerhasil(false);
		setKeranjang((sekarang) => {
			const ada = sekarang.find((item) => item.id === id);
			if (!ada) return [...sekarang, { id, jumlah: 1 }];
			return sekarang.map((item) =>
				item.id === id ? { ...item, jumlah: item.jumlah + 1 } : item,
			);
		});
	}

	function ubahJumlah(id, delta) {
		setKeranjang((sekarang) =>
			sekarang.flatMap((item) => {
				if (item.id !== id) return [item];
				const jumlah = item.jumlah + delta;
				return jumlah > 0 ? [{ ...item, jumlah }] : [];
			}),
		);
	}

	function bukaKonfirmasi(event) {
		event.preventDefault();
		if (!bolehPesan || pesanan.length === 0) return;
		setMetode("");
		setTampilKonfirmasi(true);
	}

	function bayar() {
		if (!metode || pesanan.length === 0) return;
		simpanPesananKeAdmin(pelanggan, pesanan);
		sudahBayar.current = true;
		setBerhasil(true);
		setTampilKonfirmasi(false);
	}

	function selesaiTutup() {
		if (!sudahBayar.current) return;
		sudahBayar.current = false;
		setKeranjang([]);
		setPelanggan(awalPelanggan);
		setMetode("");
	}

	function tekanBaris(event, id) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			tambah(id);
		}
	}

	function selPesan(item, isi, label) {
		return (
			<td
				className="sel-pesan"
				onClick={() => tambah(item.id)}
				onKeyDown={label ? (event) => tekanBaris(event, item.id) : undefined}
				tabIndex={label ? 0 : undefined}
				role={label ? "button" : undefined}
				aria-label={label}
			>
				{isi}
			</td>
		);
	}

	function barisMenu(item, kategori, rowSpan) {
		return (
			<tr
				key={item.id}
				className={item.cocok ? "baris-menu baris-cocok" : "baris-menu"}
			>
				{kategori != null && (
					<th className="sel-kategori" scope="rowgroup" rowSpan={rowSpan}>
						{kategori}
					</th>
				)}
				{selPesan(item, item.nama, `Tambah ${item.nama}`)}
				{selPesan(item, item.keterangan)}
				{selPesan(item, formatRupiah(item.harga))}
			</tr>
		);
	}

	return (
		<Container className="py-4 py-lg-5">
			<Row className="g-4 menu-sejajar">
				<Col lg={7} className="kolom-menu">
					<h1 className="judul-bagian">Menu</h1>
					<Row className="g-2 mb-3">
						<Col md={7}>
							<Form.Control
								type="search"
								value={cari}
								onChange={(event) => setCari(event.target.value)}
								placeholder="Cari menu..."
								aria-label="Cari menu"
							/>
						</Col>
						<Col md={5}>
							<Form.Select
								value={urutan}
								onChange={(event) => setUrutan(event.target.value)}
								aria-label="Urutkan menu"
							>
								<option value="bawaan">Urutan menu</option>
								<option value="termurah">Harga termurah</option>
								<option value="termahal">Harga termahal</option>
							</Form.Select>
						</Col>
					</Row>
					<div className="bungkus-tabel">
						<Table bordered className="tabel-menu mb-0">
							<thead>
								<tr>
									<th scope="col">Kategori</th>
									<th scope="col">Menu</th>
									<th scope="col">Keterangan</th>
									<th scope="col">Harga</th>
								</tr>
							</thead>
							<tbody>
								{sedangMenyusun
									? tampilan.map((item) => barisMenu(item, item.kategori, 1))
									: kelompokMenu.map((kelompok) =>
											kelompok.item.map((item, indeks) =>
												barisMenu(
													item,
													indeks === 0 ? kelompok.nama : null,
													kelompok.item.length,
												),
											),
										)}
								<tr className="catatan-tabel">
									<td colSpan={4}>
										<strong>Info:</strong> Klik baris menu untuk menambah
										pesanan. Semua menu dibuat segar setiap hari. Harga sudah
										termasuk pajak.
									</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</Col>

				<Col lg={5}>
					<h2 className="judul-bagian">Formulir Pemesanan</h2>
					{!bolehPesan && (
						<Alert variant="warning">
							{pengguna?.peran === "admin"
								? "Akun admin tidak bisa memesan. Sign in dengan akun pelanggan."
								: "Kamu belum bisa memesan. Sign up atau Sign in sekarang."}{" "}
							<Link to="/masuk">Sign In / Sign Up</Link>
						</Alert>
					)}
					{berhasil && (
						<Alert
							variant="success"
							onClose={() => setBerhasil(false)}
							dismissible
						>
							Pesanan berhasil.
						</Alert>
					)}
					<Card className="kartu-pesanan mb-3">
						<Card.Body>
							<h3 className="judul-kartu">Pesanan</h3>
							<div className="isi-pesanan">
								{pesanan.length === 0 ? (
									<p className="teks-kosong mb-0">
										Klik baris menu untuk menambah pesanan.
									</p>
								) : (
									<ul className="daftar-pesanan">
										{pesanan.map((item) => (
											<li key={item.id} className="baris-pesanan">
												<div>
													<strong>
														{item.nama} x{item.jumlah}
													</strong>
													<div className="harga-pesanan">
														{formatRupiah(item.harga * item.jumlah)}
													</div>
												</div>
												<div className="pengatur-jumlah">
													<Button
														type="button"
														variant="outline-primary"
														size="sm"
														onClick={() => ubahJumlah(item.id, -1)}
														aria-label={`Kurangi ${item.nama}`}
													>
														−
													</Button>
													<Button
														type="button"
														variant="outline-primary"
														size="sm"
														onClick={() => ubahJumlah(item.id, 1)}
														aria-label={`Tambah ${item.nama}`}
													>
														+
													</Button>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</Card.Body>
					</Card>

					<Form onSubmit={bukaKonfirmasi}>
						<fieldset className="form-pesan" disabled={!bolehPesan}>
						<Card className="kartu-pesanan">
							<Card.Body>
								<h3 className="judul-kartu">Data Pemesan</h3>
								<Form.Group className="mb-3" controlId="nama">
									<Form.Label>Nama Pemesan</Form.Label>
									<Form.Control
										name="nama"
										value={pelanggan.nama}
										onChange={ubahPelanggan}
										placeholder="Masukkan nama"
										required
									/>
								</Form.Group>
								<Form.Group className="mb-3" controlId="telepon">
									<Form.Label>Nomor Telepon</Form.Label>
									<Form.Control
										type="tel"
										name="telepon"
										value={pelanggan.telepon}
										onChange={ubahPelanggan}
										placeholder="08xxxxxxxxxx"
										required
									/>
								</Form.Group>
								<Form.Group className="mb-0" controlId="alamat">
									<Form.Label>Alamat</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										name="alamat"
										value={pelanggan.alamat}
										onChange={ubahPelanggan}
										placeholder="Masukkan alamat pengiriman"
										required
									/>
								</Form.Group>
							</Card.Body>
						</Card>
						<Card className="kartu-pesanan mt-3">
							<Card.Body>
								<h3 className="judul-kartu">Catatan</h3>
								<Form.Group className="mb-0" controlId="catatan">
									<Form.Label className="visually-hidden">Catatan</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										name="catatan"
										value={pelanggan.catatan}
										onChange={ubahPelanggan}
										placeholder="Tambahkan catatan pesanan..."
									/>
								</Form.Group>
							</Card.Body>
						</Card>
						<Button
							type="submit"
							variant="primary"
							className="w-100 btn-konfirmasi mt-3"
							disabled={!bolehPesan || pesanan.length === 0}
						>
							Konfirmasi Pesanan
						</Button>
						</fieldset>
					</Form>
				</Col>
			</Row>

			<Modal
				show={tampilKonfirmasi}
				onHide={() => setTampilKonfirmasi(false)}
				onExited={selesaiTutup}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Konfirmasi Pesanan</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="mb-1">
						<strong>{pelanggan.nama}</strong>
					</p>
					<p className="mb-1">{pelanggan.telepon}</p>
					<p className={pelanggan.catatan ? "mb-1" : "mb-3"}>
						{pelanggan.alamat}
					</p>
					{pelanggan.catatan && (
						<p className="mb-3">
							<strong>Catatan:</strong> {pelanggan.catatan}
						</p>
					)}
					<ul className="daftar-pesanan">
						{pesanan.map((item) => (
							<li key={item.id} className="baris-pesanan">
								<span>
									{item.nama} x{item.jumlah}
								</span>
								<span>{formatRupiah(item.harga * item.jumlah)}</span>
							</li>
						))}
					</ul>
					<p className="total-pesanan">
						Total <strong>{formatRupiah(total)}</strong>
					</p>
					<Form.Group controlId="metode-bayar">
						<Form.Label>Metode Pembayaran</Form.Label>
						<Form.Select
							value={metode}
							onChange={(event) => setMetode(event.target.value)}
						>
							<option value="">Pilih metode pembayaran</option>
							{metodeBayar.map((item) => (
								<option key={item.nilai} value={item.nilai}>
									{item.label}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button
						type="button"
						variant="primary"
						className="w-100 btn-konfirmasi"
						onClick={bayar}
						disabled={!metode}
					>
						Bayar
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
