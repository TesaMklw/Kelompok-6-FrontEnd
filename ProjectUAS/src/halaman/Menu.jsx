import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { cariMenu, formatRupiah, kelompokMenu } from "../data/menu";

const awal = {
  nama: "",
  whatsapp: "",
  menu: "",
  jumlah: 1,
  catatan: "",
};

export default function Menu() {
  const [formulir, setFormulir] = useState(awal);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    document.title = "Warung Wong Deso - Menu";
  }, []);

  function ubah(event) {
    const { name, value } = event.target;
    setFormulir((sekarang) => ({ ...sekarang, [name]: value }));
  }

  function kirim(event) {
    event.preventDefault();
    const dipilih = cariMenu(formulir.menu);
    if (!dipilih) return;
    setPesan(
      `Pesanan ${dipilih.nama} sebanyak ${formulir.jumlah} atas nama ${formulir.nama} sudah kami catat. Kami akan menghubungi ${formulir.whatsapp}.`,
    );
    setFormulir(awal);
  }

  return (
    <Container className="py-4 py-lg-5">
      <Row className="g-4 align-items-start">
        <Col lg={7}>
          <h1 className="judul-bagian">Menu</h1>
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
                {kelompokMenu.map((kelompok) =>
                  kelompok.item.map((item, indeks) => (
                    <tr key={item.id}>
                      {indeks === 0 && (
                        <th
                          className="sel-kategori"
                          scope="rowgroup"
                          rowSpan={kelompok.item.length}
                        >
                          {kelompok.nama}
                        </th>
                      )}
                      <td>{item.nama}</td>
                      <td>{item.keterangan}</td>
                      <td>{formatRupiah(item.harga)}</td>
                    </tr>
                  )),
                )}
                <tr className="catatan-tabel">
                  <td colSpan={4}>
                    <strong>Info:</strong> Semua menu dibuat segar setiap hari.
                    Harga sudah termasuk pajak.
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>

        <Col lg={5}>
          <h2 className="judul-bagian">Formulir Pemesanan</h2>
          {pesan && (
            <Alert variant="success" onClose={() => setPesan("")} dismissible>
              {pesan}
            </Alert>
          )}
          <Form className="formulir-pesan" onSubmit={kirim}>
            <Form.Group className="mb-3" controlId="nama">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                name="nama"
                value={formulir.nama}
                onChange={ubah}
                placeholder="Masukkan nama"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="whatsapp">
              <Form.Label>Nomor WhatsApp</Form.Label>
              <Form.Control
                type="tel"
                name="whatsapp"
                value={formulir.whatsapp}
                onChange={ubah}
                placeholder="08xxxxxxxxxx"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pilih-menu">
              <Form.Label>Pilih Menu</Form.Label>
              <Form.Select
                name="menu"
                value={formulir.menu}
                onChange={ubah}
                required
              >
                <option value="">Pilih menu</option>
                {kelompokMenu.map((kelompok) => (
                  <optgroup key={kelompok.nama} label={kelompok.nama}>
                    {kelompok.item.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama} - {formatRupiah(item.harga)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="jumlah">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control
                type="number"
                name="jumlah"
                min="1"
                value={formulir.jumlah}
                onChange={ubah}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="catatan">
              <Form.Label>Catatan</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="catatan"
                value={formulir.catatan}
                onChange={ubah}
                placeholder="Tambahkan catatan pesanan..."
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Kirim Pesanan
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
