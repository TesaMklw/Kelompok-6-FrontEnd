import { useEffect, useMemo, useState } from "react";
import {
	Badge,
	Button,
	Card,
	Col,
	Container,
	Form,
	ListGroup,
	Modal,
	ProgressBar,
	Row,
	Table,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const STORAGE_KEY = "warung-wong-deso-admin";

const defaultMenu = [];

const defaultOrders = [];

const statusSteps = ["Menunggu", "Dimasak", "Siap diantar", "Selesai"];
const formulirKosong = {
	nama: "",
	kategori: "Menu Utama",
	harga: "",
	deskripsi: "",
};
const formatRupiah = (nilai) => `Rp\u00a0${Number(nilai).toLocaleString("id-ID")}`;

function readStoredData() {
	if (typeof window === "undefined") {
		return { menu: defaultMenu, orders: defaultOrders };
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return { menu: defaultMenu, orders: defaultOrders };
		const parsed = JSON.parse(raw);
		return {
			menu: Array.isArray(parsed.menu) && parsed.menu.length ? parsed.menu : defaultMenu,
			orders: Array.isArray(parsed.orders) && parsed.orders.length ? parsed.orders : defaultOrders,
		};
	} catch {
		return { menu: defaultMenu, orders: defaultOrders };
	}
}

export default function Admin() {
	const { pengguna, keluar } = useAuth();
	const navigate = useNavigate();
	const adminAktif = pengguna?.peran === "admin";
	const [tab, setTab] = useState("dashboard");
	const [menu, setMenu] = useState(() => readStoredData().menu);
	const [orders, setOrders] = useState(() => readStoredData().orders);
	const [form, setForm] = useState(formulirKosong);
	const [editingId, setEditingId] = useState(null);
	const [tampilReset, setTampilReset] = useState(false);
	const [konfirmasiMenu, setKonfirmasiMenu] = useState(null);

	useEffect(() => {
		document.title = "Warung Wong Deso - Panel Admin";
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ menu, orders }));
		}
	}, [menu, orders]);

	const totalPendapatan = useMemo(
		() => orders.reduce((sum, item) => sum + Number(item.total || 0), 0),
		[orders],
	);

	const chartValues = useMemo(() => {
		if (!orders.length) return Array(7).fill(0);

		const data = Array(7).fill(0);
		orders.forEach((_, index) => {
			const slot = index % 7;
			data[slot] += 18 + (index % 4) * 10;
		});

		return data.map((value) => Math.min(100, value));
	}, [orders]);

	const ringkasan = [
		{ label: "Pendapatan Hari Ini", nilai: formatRupiah(totalPendapatan), tren: "+12.4%", warna: "success" },
		{ label: "Pesanan Baru", nilai: `${orders.length}`, tren: "+8.2%", warna: "primary" },
		{ label: "Menu Aktif", nilai: `${menu.length}`, tren: "+3", warna: "warning" },
		{ label: "Rating Rata-rata", nilai: "4.9/5", tren: "+0.2", warna: "danger" },
	];

	const menuPopuler = useMemo(() => {
		const hitung = {};

		orders.forEach((order) => {
			const daftar = String(order.menu || "").split(",");
			daftar.forEach((item) => {
				const namaMenu = item.trim();
				if (!namaMenu) return;
				const key = namaMenu.replace(/\s*x\d+$/i, "");
				if (!key) return;
				hitung[key] = (hitung[key] || 0) + 1;
			});
		});

		const data = Object.entries(hitung)
			.map(([nama, penjualan]) => ({
				nama,
				penjualan,
				porsi: Math.min(100, Math.max(35, penjualan * 18)),
			}))
			.sort((a, b) => b.penjualan - a.penjualan)
			.slice(0, 4);

		return data.length ? data : [{ nama: "Belum ada data", penjualan: 0, porsi: 0 }];
	}, [orders]);

	const aktivitas = useMemo(() => {
		if (!orders.length) {
			return ["Belum ada pesanan masuk. Dashboard siap menampilkan data saat pelanggan mulai memesan."];
		}

		const statusRingkas = orders.reduce((hasil, order) => {
			hasil[order.status] = (hasil[order.status] || 0) + 1;
			return hasil;
		}, {});

		return [
			`${orders.length} pesanan telah masuk ke sistem.`,
			`Status terbanyak: ${Object.entries(statusRingkas).sort((a, b) => b[1] - a[1])[0]?.[0] || "Menunggu"}.`,
			`Pesanan terbaru: ${orders[orders.length - 1]?.nama || "-"}.`,
		];
	}, [orders]);

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setKonfirmasiMenu({
			jenis: editingId ? "ubah" : "tambah",
			item: {
				id: editingId ?? Date.now(),
				nama: form.nama,
				kategori: form.kategori,
				harga: Number(form.harga) || 0,
				deskripsi: form.deskripsi,
			},
		});
	};

	const jalankanKonfirmasiMenu = () => {
		if (!konfirmasiMenu) return;
		const { jenis, item } = konfirmasiMenu;

		if (jenis === "hapus") {
			setMenu((current) => current.filter((menuItem) => menuItem.id !== item.id));
			if (editingId === item.id) {
				setEditingId(null);
				setForm(formulirKosong);
			}
		} else if (jenis === "ubah") {
			setMenu((current) => current.map((menuItem) => (menuItem.id === item.id ? item : menuItem)));
			setEditingId(null);
			setForm(formulirKosong);
		} else {
			setMenu((current) => [item, ...current]);
			setForm(formulirKosong);
		}

		setKonfirmasiMenu(null);
	};

	const handleEdit = (item) => {
		setEditingId(item.id);
		setForm({
			nama: item.nama,
			kategori: item.kategori,
			harga: String(item.harga),
			deskripsi: item.deskripsi,
		});
		setTab("menu");
	};

	const mintaHapus = (item) => {
		setKonfirmasiMenu({ jenis: "hapus", item });
	};

	const updateOrderStatus = (id, status) => {
		setOrders((current) =>
			current.map((order) => (order.id === id ? { ...order, status } : order)),
		);
	};

	const handleLogout = () => {
		keluar();
		navigate("/");
	};

	const resetAdminData = () => {
		setMenu([]);
		setOrders([]);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ menu: [], orders: [] }));
		}
		setTampilReset(false);
	};

	if (!adminAktif) {
		return (
			<Container className="py-5">
				<Row className="justify-content-center">
					<Col xs={12} md={7} lg={5}>
						<Card className="shadow-sm border-0 admin-login-card">
							<Card.Body className="p-4 p-lg-5 text-center">
								<p className="eyebrow mb-2"><span aria-hidden="true" /> Panel Admin</p>
								<h1 className="judul-bagian mb-3">Sign in sebagai admin</h1>
								<p className="teks-pendukung mx-auto mb-4">
									Admin masuk dari halaman yang sama dengan pelanggan. Gunakan akun admin pada halaman Sign In.
								</p>
								<Button as={Link} to="/masuk" variant="primary">
									Sign In / Sign Up
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<Container className="py-4 py-lg-5 admin-panel">
			<div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
				<div>
					<p className="eyebrow mb-2"><span aria-hidden="true" /> Dashboard Admin</p>
					<h1 className="judul-bagian mb-1">Panel Kelola Warung</h1>
				</div>
				<div className="admin-tab-group">
					<Button variant={tab === "dashboard" ? "primary" : "outline-primary"} onClick={() => setTab("dashboard")}>Dashboard</Button>
					<Button variant={tab === "menu" ? "primary" : "outline-primary"} onClick={() => setTab("menu")}>Kelola Menu</Button>
					<Button variant={tab === "orders" ? "primary" : "outline-primary"} onClick={() => setTab("orders")}>Pesanan</Button>
					<Button variant="outline-danger" onClick={() => setTampilReset(true)}>Reset Data</Button>
					<Button variant="outline-secondary" onClick={handleLogout}>Keluar</Button>
				</div>
			</div>

			{tab === "dashboard" && (
				<>
					<Row className="g-3 mb-4">
						{ringkasan.map((item) => (
							<Col xs={12} sm={6} lg={3} key={item.label}>
								<Card className="h-100 shadow-sm border-0 admin-card">
									<Card.Body>
										<div className="d-flex justify-content-between align-items-start mb-3">
											<span className="admin-stat-label">{item.label}</span>
											<Badge bg={item.warna} pill>{item.tren}</Badge>
										</div>
										<h2 className="admin-stat-value mb-0">{item.nilai}</h2>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>

					<Row className="g-4 mb-4">
						<Col lg={8}>
							<Card className="shadow-sm border-0 admin-card h-100">
								<Card.Body>
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h3 className="judul-kartu mb-0">Penjualan Hingga Hari Ini</h3>
										<span className="admin-small-text">Update 30 menit lalu</span>
									</div>
									<div className="admin-chart" aria-label="Grafik penjualan">
										{chartValues.map((value, index) => (
											<div key={index} className="admin-bar-wrap">
												<div className="admin-bar" style={{ height: `${value}%` }} />
											</div>
										))}
									</div>
									<div className="d-flex justify-content-between mt-3 admin-small-text">
										<span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
									</div>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={4}>
							<Card className="shadow-sm border-0 admin-card h-100">
								<Card.Body>
									<h3 className="judul-kartu mb-3">Aktivitas Terbaru</h3>
									<ListGroup variant="flush">
										{aktivitas.map((item) => (
											<ListGroup.Item key={item} className="admin-activity-item">{item}</ListGroup.Item>
										))}
									</ListGroup>
								</Card.Body>
							</Card>
						</Col>
					</Row>

					<Row className="g-4">
						<Col lg={7}>
							<Card className="shadow-sm border-0 admin-card h-100">
								<Card.Body>
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h3 className="judul-kartu mb-0">Pesanan Terbaru</h3>
										<Button variant="outline-primary" size="sm">Lihat Semua</Button>
									</div>
									<Table responsive className="admin-table mb-0">
										<thead>
											<tr><th>ID</th><th>Pelanggan</th><th>Menu</th><th>Total</th><th>Status</th></tr>
										</thead>
										<tbody>
											{orders.map((item) => (
												<tr key={item.id}>
													<td>{item.id}</td>
													<td>{item.nama}</td>
													<td>{item.menu}</td>
													<td>{formatRupiah(item.total)}</td>
													<td>
														<Badge bg={item.status === "Selesai" ? "success" : item.status === "Siap diantar" ? "primary" : item.status === "Dimasak" ? "warning" : "secondary"}>
															{item.status}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={5}>
							<Card className="shadow-sm border-0 admin-card h-100">
								<Card.Body>
									<h3 className="judul-kartu mb-3">Menu Paling Laku</h3>
									{menuPopuler.map((item) => (
										<div key={item.nama} className="mb-3">
											<div className="d-flex justify-content-between mb-1">
												<strong>{item.nama}</strong>
												<span>{item.penjualan} pesanan</span>
											</div>
											<ProgressBar now={item.porsi} variant="primary" />
										</div>
									))}
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</>
			)}

			{tab === "menu" && (
				<Row className="g-4">
					<Col lg={5}>
						<Card className="shadow-sm border-0 admin-card h-100">
							<Card.Body>
								<h3 className="judul-kartu mb-3">{editingId ? "Ubah Menu" : "Tambah Menu Baru"}</h3>
								<Form onSubmit={handleSubmit}>
									<Form.Group className="mb-3">
										<Form.Label>Nama Menu</Form.Label>
										<Form.Control name="nama" value={form.nama} onChange={handleFormChange} placeholder="Contoh: Ayam Kremes" required />
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Kategori</Form.Label>
										<Form.Select name="kategori" value={form.kategori} onChange={handleFormChange}>
											<option>Menu Utama</option>
											<option>Lauk Tambahan</option>
											<option>Minuman</option>
										</Form.Select>
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Harga</Form.Label>
										<Form.Control name="harga" type="number" min="0" value={form.harga} onChange={handleFormChange} placeholder="15000" required />
									</Form.Group>
									<Form.Group className="mb-3">
										<Form.Label>Deskripsi</Form.Label>
										<Form.Control as="textarea" rows={3} name="deskripsi" value={form.deskripsi} onChange={handleFormChange} placeholder="Masukkan deskripsi menu" />
									</Form.Group>
									<div className="d-flex gap-2">
										<Button type="submit" variant="primary">{editingId ? "Simpan Perubahan" : "Tambah Menu"}</Button>
										{editingId && (
											<Button variant="outline-secondary" onClick={() => {
												setEditingId(null);
												setForm(formulirKosong);
											}}>
												Batal
											</Button>
										)}
									</div>
								</Form>
							</Card.Body>
						</Card>
					</Col>
					<Col lg={7}>
						<Card className="shadow-sm border-0 admin-card h-100">
							<Card.Body>
								<h3 className="judul-kartu mb-3">Daftar Menu</h3>
								<Table responsive className="admin-table mb-0">
									<thead>
										<tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Deskripsi</th><th>Aksi</th></tr>
									</thead>
									<tbody>
										{menu.length === 0 ? (
											<tr>
												<td colSpan={5} className="text-center py-4 text-muted">
													Belum ada menu tambahan. Tambah menu di formulir sebelah kiri, lalu pilih barisnya untuk diubah atau dihapus.
												</td>
											</tr>
										) : (
											menu.map((item) => (
												<tr
													key={item.id}
													className={editingId === item.id ? "baris-menu baris-terpilih" : "baris-menu"}
													onClick={() => handleEdit(item)}
												>
													<td>{item.nama}</td>
													<td>{item.kategori}</td>
													<td className="text-nowrap">{formatRupiah(item.harga)}</td>
													<td>{item.deskripsi}</td>
													<td>
														<div className="d-flex gap-2">
															<Button size="sm" variant="outline-primary" onClick={(event) => {
																event.stopPropagation();
																handleEdit(item);
															}}>
																Ubah
															</Button>
															<Button size="sm" variant="outline-danger" onClick={(event) => {
																event.stopPropagation();
																mintaHapus(item);
															}}>
																Hapus
															</Button>
														</div>
													</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{tab === "orders" && (
				<Card className="shadow-sm border-0 admin-card order-table-card">
					<Card.Body className="p-0">
						<div className="order-table-header">
							<h3 className="judul-kartu mb-0">Kelola Status Pesanan</h3>
						</div>
						<Table responsive className="admin-order-table mb-0">
							<thead>
								<tr>
									<th>ID</th>
									<th>PELANGGAN</th>
									<th>MENU</th>
									<th>TOTAL</th>
									<th>STATUS</th>
									<th>AKSI</th>
								</tr>
							</thead>
							<tbody>
								{orders.length === 0 ? (
									<tr>
										<td colSpan={6} className="text-center py-4 text-muted">
											Belum ada pesanan masuk. Setelah pelanggan melakukan checkout, data akan muncul di sini.
										</td>
									</tr>
								) : (
									orders.map((order) => (
										<tr key={order.id}>
											<td>{order.id}</td>
											<td>{order.nama}</td>
											<td>{order.menu}</td>
											<td>{formatRupiah(order.total)}</td>
											<td>
												<Badge bg={order.status === "Selesai" ? "success" : order.status === "Siap diantar" ? "primary" : order.status === "Dimasak" ? "warning" : "secondary"}>
													{order.status}
												</Badge>
											</td>
											<td>
												<div className="status-action-group">
													{statusSteps.map((status) => (
														<Button
															key={status}
															size="sm"
															variant={order.status === status ? "primary" : "outline-secondary"}
															onClick={() => updateOrderStatus(order.id, status)}
															className={order.status === status ? "status-action active" : "status-action"}
														>
															{status}
														</Button>
													))}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</Table>
					</Card.Body>
				</Card>
			)}

			<Modal show={Boolean(konfirmasiMenu)} onHide={() => setKonfirmasiMenu(null)} centered>
				<Modal.Header closeButton>
					<Modal.Title>
						{konfirmasiMenu?.jenis === "hapus" && "Hapus Menu"}
						{konfirmasiMenu?.jenis === "ubah" && "Ubah Menu"}
						{konfirmasiMenu?.jenis === "tambah" && "Tambah Menu"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{konfirmasiMenu?.jenis === "hapus" && `Yakin ingin menghapus menu "${konfirmasiMenu.item.nama}"?`}
					{konfirmasiMenu?.jenis === "ubah" && `Yakin ingin menyimpan perubahan menu "${konfirmasiMenu.item.nama}"?`}
					{konfirmasiMenu?.jenis === "tambah" && `Yakin ingin menambahkan menu "${konfirmasiMenu.item.nama}"?`}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={() => setKonfirmasiMenu(null)}>
						Batal
					</Button>
					{konfirmasiMenu?.jenis === "hapus" && (
						<Button variant="outline-danger" onClick={jalankanKonfirmasiMenu}>Ya, hapus</Button>
					)}
					{konfirmasiMenu?.jenis === "ubah" && (
						<Button variant="primary" onClick={jalankanKonfirmasiMenu}>Ya, simpan</Button>
					)}
					{konfirmasiMenu?.jenis === "tambah" && (
						<Button variant="primary" onClick={jalankanKonfirmasiMenu}>Ya, tambah</Button>
					)}
				</Modal.Footer>
			</Modal>

			<Modal show={tampilReset} onHide={() => setTampilReset(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Reset Data</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Yakin ingin menghapus semua menu tambahan dan pesanan?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={() => setTampilReset(false)}>
						Batal
					</Button>
					<Button variant="outline-danger" onClick={resetAdminData}>
						Ya, reset
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
