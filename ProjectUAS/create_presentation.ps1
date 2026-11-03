$ErrorActionPreference = 'Stop'

function Color([string]$hex) {
    $value = $hex.TrimStart('#')
    return [Convert]::ToInt32($value.Substring(0, 2), 16) +
        ([Convert]::ToInt32($value.Substring(2, 2), 16) -shl 8) +
        ([Convert]::ToInt32($value.Substring(4, 2), 16) -shl 16)
}

$ink = Color '#3E2723'
$maroon = Color '#6B2C2C'
$cream = Color '#F8F1E7'
$paper = Color '#FFFAF0'
$line = Color '#D8C3A5'
$muted = Color '#75675B'
$white = Color '#FFFFFF'
$green = Color '#536A54'
$dark = Color '#30201D'

function Add-Rect($slide, [double]$x, [double]$y, [double]$w, [double]$h, $fill, [bool]$round = $false) {
    $shapeType = if ($round) { 5 } else { 1 }
    $shape = $slide.Shapes.AddShape($shapeType, $x, $y, $w, $h)
    $shape.Fill.ForeColor.RGB = $fill
    $shape.Line.Visible = 0
    return $shape
}

function Add-Text($slide, [string]$text, [double]$x, [double]$y, [double]$w, [double]$h, [double]$size = 18, $color = $ink, [string]$font = 'Aptos', [bool]$bold = $false, [int]$align = 1) {
    $shape = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
    $shape.Fill.Transparency = 1
    $shape.Line.Visible = 0
    $frame = $shape.TextFrame
    $frame.MarginLeft = 0
    $frame.MarginRight = 0
    $frame.MarginTop = 0
    $frame.MarginBottom = 0
    $frame.WordWrap = -1
    $frame.AutoSize = 0
    $range = $frame.TextRange
    $range.Text = $text
    $range.Font.Name = $font
    $range.Font.Size = $size
    $range.Font.Color.RGB = $color
    $range.Font.Bold = $bold
    $range.ParagraphFormat.Alignment = $align
    $range.ParagraphFormat.SpaceAfter = 3
    return $shape
}

function Add-Image($slide, [string]$path, [double]$x, [double]$y, [double]$w, [double]$h) {
    if (-not (Test-Path $path)) {
        throw "Gambar tidak ditemukan: $path"
    }
    return $slide.Shapes.AddPicture($path, 0, -1, $x, $y, $w, $h)
}

function Add-Base($presentation, [string]$title, [int]$number) {
    $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, 12)
    Add-Rect $slide 0 0 960 540 $cream | Out-Null
    Add-Rect $slide 0 0 960 9 $maroon | Out-Null
    Add-Text $slide $title 54 30 850 47 28 $ink 'Georgia' $true | Out-Null
    Add-Rect $slide 54 88 852 1 $line | Out-Null
    Add-Text $slide 'PROJECT UAS  /  WARUNG WONG DESO' 54 510 650 18 10 $muted 'Aptos' $true | Out-Null
    Add-Text $slide ('{0:D2}' -f $number) 866 507 40 20 11 $maroon 'Aptos' $true 3 | Out-Null
    return $slide
}

function Add-Card($slide, [double]$x, [double]$y, [double]$w, [double]$h, [string]$title, [string]$body, [int]$titleSize = 17, [int]$bodySize = 14) {
    Add-Rect $slide $x $y $w $h $paper $true | Out-Null
    Add-Text $slide $title ($x + 16) ($y + 14) ($w - 32) 28 $titleSize $maroon 'Aptos' $true | Out-Null
    Add-Text $slide $body ($x + 16) ($y + 49) ($w - 32) ($h - 58) $bodySize $ink | Out-Null
}

$root = $PSScriptRoot
$imageWarung = Join-Path $root 'src\assets\foto-warung-makan-wonddeso.png'
$imageNasi = Join-Path $root 'src\assets\nasi-kotak-siap-antar.jpg'
$imageIkan = Join-Path $root 'src\assets\pengunjung-ikan-bakar.jpg'
$imageSuasana = Join-Path $root 'src\assets\suasana-warung.jpg'
$output = Join-Path $root 'Presentasi_ProjectUAS_React_Bootstrap.pptx'

$powerpoint = New-Object -ComObject PowerPoint.Application
$powerpoint.Visible = -1
$deck = $powerpoint.Presentations.Add()
$deck.PageSetup.SlideWidth = 960
$deck.PageSetup.SlideHeight = 540

# 1. Sampul
$slide = $deck.Slides.Add(1, 12)
Add-Rect $slide 0 0 960 540 $dark | Out-Null
Add-Rect $slide 0 0 14 540 $maroon | Out-Null
Add-Image $slide $imageWarung 555 52 345 400 | Out-Null
Add-Rect $slide 535 72 345 400 $green $true | Out-Null
Add-Image $slide $imageWarung 520 54 345 400 | Out-Null
Add-Text $slide 'PRESENTASI PROJECT UAS' 60 92 430 25 14 $line 'Aptos' $true | Out-Null
Add-Text $slide "Warung Wong`nDeso" 60 142 440 142 46 $paper 'Georgia' $true | Out-Null
Add-Text $slide 'Website informasi & pemesanan warung makan' 62 301 410 55 21 $paper | Out-Null
Add-Rect $slide 62 380 360 2 $maroon | Out-Null
Add-Text $slide 'React  +  Bootstrap' 62 403 360 34 22 $line 'Aptos' $true | Out-Null
Add-Text $slide 'Kelompok 6  |  Front End Programming' 62 465 430 25 14 $paper | Out-Null
Add-Text $slide '2026' 845 495 65 22 12 $paper 'Aptos' $true 3 | Out-Null

# 2. Tujuan proyek
$slide = Add-Base $deck 'Tujuan & gambaran proyek' 2
Add-Text $slide 'Satu website untuk membantu calon pelanggan mengenal warung dan menemukan informasi penting sebelum berkunjung atau memesan.' 58 112 840 58 20 $ink 'Aptos' $false | Out-Null
Add-Card $slide 58 198 263 190 'Informasi jelas' "Profil, alamat, jam/identitas usaha, kontak, dan suasana warung disajikan dalam satu tempat."
Add-Card $slide 348 198 263 190 'Menu mudah dicari' "Daftar makanan, minuman, kategori, keterangan, dan harga tersusun dalam tabel."
Add-Card $slide 638 198 263 190 'Interaksi sederhana' "Pengunjung dapat mengisi formulir pemesanan dan mengirim ulasan melalui antarmuka website."
Add-Text $slide 'Tagline: "Rasa ndeso, hati legowo."' 58 424 840 30 19 $maroon 'Georgia' $true 2 | Out-Null

# 3. Fitur dan halaman
$slide = Add-Base $deck 'Apa saja yang bisa dilakukan pengunjung?' 3
Add-Text $slide 'Navigasi utama menghubungkan lima bagian website:' 58 109 840 32 17 $muted | Out-Null
Add-Card $slide 58 160 263 126 'Beranda' 'Pengenalan singkat, foto warung, dan tombol menuju menu.' 16 13
Add-Card $slide 348 160 263 126 'Menu' 'Tabel menu dan formulir pemesanan dengan validasi dasar.' 16 13
Add-Card $slide 638 160 263 126 'Galeri' 'Foto hidangan, pengunjung, pesanan, dan suasana warung.' 16 13
Add-Card $slide 203 315 263 126 'Ulasan' 'Form untuk menulis ulasan dan konfirmasi setelah dikirim.' 16 13
Add-Card $slide 493 315 263 126 'Tentang Kami' 'Profil, statistik, peta lokasi, alamat, email, dan telepon.' 16 13
Add-Text $slide 'Rute aplikasi: /  |  /menu  |  /galeri  |  /ulasan  |  /tentang' 58 463 840 25 15 $maroon 'Consolas' $true 2 | Out-Null

# 4. Teknologi
$slide = Add-Base $deck 'Teknologi yang digunakan' 4
Add-Card $slide 58 127 402 132 'React 19' 'Antarmuka dibangun dari komponen dan halaman JSX. State mengelola perubahan formulir.' 18 14
Add-Card $slide 500 127 402 132 'React Bootstrap + Bootstrap 5' 'Komponen UI React dan sistem grid responsif: Container, Row, Col, Navbar, Form, Table, Alert.' 18 14
Add-Card $slide 58 286 402 132 'React Router 7' 'Mengatur perpindahan antarrute tanpa memuat ulang seluruh halaman.' 18 14
Add-Card $slide 500 286 402 132 'Vite 8' 'Menjalankan server pengembangan dan membangun aset untuk distribusi.' 18 14
Add-Text $slide 'Versi mengikuti dependensi pada package.json proyek.' 58 446 840 25 13 $muted | Out-Null

# 5. Struktur aplikasi
$slide = Add-Base $deck 'Struktur aplikasi: satu layout, banyak halaman' 5
Add-Rect $slide 280 111 400 52 $maroon $true | Out-Null
Add-Text $slide 'BrowserRouter  >  Routes' 296 125 370 24 19 $white 'Consolas' $true 2 | Out-Null
Add-Rect $slide 280 183 400 52 $green $true | Out-Null
Add-Text $slide 'TataLetak: Navigasi + Outlet + Kaki' 292 197 376 24 16 $white 'Aptos' $true 2 | Out-Null
Add-Rect $slide 473 163 2 20 $line | Out-Null
Add-Rect $slide 112 263 736 2 $line | Out-Null
Add-Rect $slide 112 263 2 26 $line | Out-Null
Add-Rect $slide 296 263 2 26 $line | Out-Null
Add-Rect $slide 480 263 2 26 $line | Out-Null
Add-Rect $slide 664 263 2 26 $line | Out-Null
Add-Rect $slide 848 263 2 26 $line | Out-Null
Add-Card $slide 58 291 170 88 'Beranda' 'Route index' 16 12
Add-Card $slide 242 291 170 88 'Galeri' '/galeri' 16 12
Add-Card $slide 426 291 170 88 'Menu' '/menu' 16 12
Add-Card $slide 610 291 170 88 'Ulasan' '/ulasan' 16 12
Add-Card $slide 794 291 112 88 'Tentang' '/tentang' 15 12
Add-Text $slide 'Komponen bersama dipakai ulang; Outlet menampilkan halaman sesuai URL.' 74 410 812 40 17 $ink 'Aptos' $false 2 | Out-Null

# 6. Contoh React: routing dan komponen
$slide = Add-Base $deck 'React: halaman dipisah menjadi komponen' 6
$code = @'
<BrowserRouter>
  <Routes>
    <Route element={<TataLetak />}>
      <Route index element={<Beranda />} />
      <Route path="galeri" element={<Galeri />} />
      <Route path="menu" element={<Menu />} />
      <Route path="ulasan" element={<Ulasan />} />
      <Route path="tentang" element={<Tentang />} />
    </Route>
  </Routes>
</BrowserRouter>
'@
Add-Rect $slide 58 116 530 337 $dark $true | Out-Null
Add-Text $slide $code 78 133 493 315 14 $paper 'Consolas' | Out-Null
Add-Text $slide 'Yang ditunjukkan:' 628 128 270 28 18 $maroon 'Aptos' $true | Out-Null
Add-Text $slide "- App() adalah komponen React.`n- JSX menyusun struktur UI.`n- Routes memetakan URL ke halaman.`n- TataLetak membungkus Navigasi, Outlet, dan Kaki.`n- Halaman dapat dikembangkan terpisah." 628 170 275 200 16 $ink | Out-Null
Add-Text $slide 'Sumber: src/App.jsx' 628 405 260 24 13 $muted 'Consolas' | Out-Null

# 7. Contoh React: state formulir
$slide = Add-Base $deck 'React: state menjaga formulir tetap sinkron' 7
$code = @'
const [formulir, setFormulir] = useState(awal);

function ubah(event) {
  const { name, value } = event.target;
  setFormulir((sekarang) => ({
    ...sekarang, [name]: value
  }));
}

<Form.Control
  name="nama"
  value={formulir.nama}
  onChange={ubah}
  required
/>
'@
Add-Rect $slide 58 118 516 322 $dark $true | Out-Null
Add-Text $slide $code 78 137 480 288 14 $paper 'Consolas' | Out-Null
Add-Text $slide 'Alur interaksi' 624 128 270 28 18 $maroon 'Aptos' $true | Out-Null
Add-Text $slide "1. useState menyimpan nilai awal.`n2. onChange membaca input dan memperbarui state.`n3. onSubmit mencegah reload halaman.`n4. Aplikasi menampilkan Alert konfirmasi.`n5. Formulir kembali ke nilai awal." 624 170 278 175 16 $ink | Out-Null
Add-Text $slide 'Catatan: konfirmasi pesanan saat ini berjalan di front-end; belum terhubung ke server/database.' 624 366 278 63 13 $muted | Out-Null
Add-Text $slide 'Sumber: src/halaman/Menu.jsx' 58 463 500 22 13 $muted 'Consolas' | Out-Null

# 8. Contoh Bootstrap
$slide = Add-Base $deck 'Bootstrap: layout responsif dengan komponen React' 8
$code = @'
<Container className="py-4 py-lg-5">
  <Row className="align-items-center g-4">
    <Col lg={6}>
      <h1>Rasa ndeso...</h1>
      <Button as={Link} to="/menu">
        Lihat menu
      </Button>
    </Col>
    <Col lg={6}>
      <img src={foto.src} alt={foto.alt} />
    </Col>
  </Row>
</Container>
'@
Add-Rect $slide 58 116 530 350 $dark $true | Out-Null
Add-Text $slide $code 78 132 492 315 14 $paper 'Consolas' | Out-Null
Add-Text $slide 'Yang dipakai di proyek' 624 125 276 28 18 $maroon 'Aptos' $true | Out-Null
Add-Text $slide "Container  - lebar konten dan padding.`nRow + Col lg={6}  - dua kolom di layar lebar, bertumpuk di layar kecil.`nNavbar expand=`"lg`"  - navigasi responsif.`nForm, Table, Alert, Card, Button  - komponen siap pakai.`nKelas g-4, py-4, w-100  - spacing dan utilitas." 624 169 278 230 15 $ink | Out-Null
Add-Text $slide 'CSS proyek menyesuaikan warna Bootstrap agar selaras dengan tema warung.' 624 411 278 44 13 $muted | Out-Null

# 9. Menu dan pemesanan
$slide = Add-Base $deck 'Fitur utama: menu dan formulir pemesanan' 9
Add-Image $slide $imageNasi 58 120 330 226 | Out-Null
Add-Rect $slide 58 120 330 226 $dark $true | Out-Null
Add-Image $slide $imageNasi 58 120 330 226 | Out-Null
Add-Text $slide 'Data menu' 432 121 210 28 18 $maroon 'Aptos' $true | Out-Null
Add-Text $slide "- Data disimpan terstruktur di src/data/menu.js.`n- Dikelompokkan menjadi menu utama, lauk tambahan, dan minuman.`n- Di-render memakai .map() ke dalam Bootstrap Table.`n- formatRupiah() menampilkan harga sesuai format Indonesia." 432 159 452 132 15 $ink | Out-Null
Add-Text $slide 'Form pesanan' 432 306 210 28 18 $maroon 'Aptos' $true | Out-Null
Add-Text $slide 'Nama, WhatsApp, menu, jumlah, dan catatan. React Bootstrap Form mengatur input; required memberi validasi dasar; Alert menyampaikan hasil.' 432 344 452 82 15 $ink | Out-Null
Add-Text $slide 'Demo: buka Menu -> isi data -> pilih menu -> Kirim Pesanan.' 58 405 330 42 13 $paper 'Aptos' $true 2 | Out-Null

# 10. Galeri dan informasi usaha
$slide = Add-Base $deck 'Galeri, ulasan, profil, dan lokasi' 10
Add-Image $slide $imageIkan 58 122 248 145 | Out-Null
Add-Image $slide $imageSuasana 330 122 248 145 | Out-Null
Add-Image $slide $imageNasi 602 122 300 145 | Out-Null
Add-Card $slide 58 296 248 125 'Galeri' 'Foto dikelola sebagai data; kartu dibuat berulang dengan .map().' 16 13
Add-Card $slide 330 296 248 125 'Ulasan' 'Form menggunakan useState dan menampilkan pesan sukses.' 16 13
Add-Card $slide 602 296 300 125 'Tentang Kami' 'Profil, statistik, peta Google Maps, alamat, email, dan telepon.' 16 13
Add-Text $slide 'Akses bagian Tentang Kami lewat menu Profil, Lokasi, dan Kontak.' 58 452 844 26 15 $muted 'Aptos' $false 2 | Out-Null

# 11. Demo dan penutup
$slide = Add-Base $deck 'Demo singkat & kesimpulan' 11
Add-Card $slide 58 120 392 290 'Urutan demo' "1. Jalankan npm install`n2. Jalankan npm run dev`n3. Buka Beranda dan navigasi ke Galeri`n4. Tampilkan Menu dan kirim contoh pesanan`n5. Tampilkan Ulasan dan Tentang Kami" 17 16
Add-Card $slide 510 120 392 290 'Kesimpulan & pengembangan' "React membantu memecah UI menjadi komponen; React Router mengatur halaman; Bootstrap mempercepat layout responsif.`n`nLangkah berikutnya: sambungkan formulir ke backend/database, simpan ulasan, dan tambahkan proses pemesanan nyata." 17 15
Add-Text $slide 'Terima kasih' 58 442 844 36 26 $maroon 'Georgia' $true 2 | Out-Null

$deck.SaveAs($output)
$deck.Close()
$powerpoint.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($deck) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerpoint) | Out-Null
[GC]::Collect()
[GC]::WaitForPendingFinalizers()
Write-Output "PPTX berhasil dibuat: $output"
