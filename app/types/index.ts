// types/index.ts — Entitas data (docs/01 §4)

export interface Warga {
  id: string
  nik: string
  noKk: string
  namaLengkap: string
  jenisKelamin: 'L' | 'P'
  tempatLahir?: string
  tanggalLahir?: string
  agama?: string
  statusPerkawinan?: string
  pekerjaan?: string
  alamat?: string
  rt: number | string
  rw: number | string
  dusun?: string
  statusWarga: 'Tetap' | 'Pendatang'
  kewarganegaraan?: string
  updatedAt?: string
}

export type WargaInput = Omit<Warga, 'id'>

export interface LaporanKematian {
  id: string
  wargaId: string
  namaWarga: string
  nikWarga: string
  rtWarga: number | string
  rwWarga: number | string
  tanggalMeninggal: string
  tempatMeninggal?: string
  namaPelapor: string
  hubunganPelapor?: string
  noHpPelapor?: string
  catatan?: string
  suratKematian?: string
  status: 'Menunggu' | 'Terverifikasi'
}

export interface Aktivitas {
  id: string
  jenis: 'Data warga ditambahkan' | 'Laporan kematian dicatat' | 'Data warga diperbarui'
  namaWarga: string
  keterangan: string
  waktu: string
}

export interface StatistikDashboard {
  totalWarga: number
  kartuKeluarga: number
  kematianBulanIni: number
  kematianMenunggu: number
  dataBelumLengkap: number
}

export interface DataGrafik {
  label: string
  value: number
}

export interface StatistikKematian {
  bulanIni: number
  periodeBulanIni: string
  bulanLalu: number
  periodeBulanLalu: string
  menungguVerifikasi: number
}

export interface RowLaporan {
  rw: string
  jumlahKk: number
  jumlahWarga: number
  lakiLaki: number
  perempuan: number
  meninggal: number
}

export interface LaporanBulanan {
  periode: string
  totalWarga: number
  wargaMeninggal: number
  dataDisperbarui: number
  wargaBaru: number
  tabelRw: RowLaporan[]
}
