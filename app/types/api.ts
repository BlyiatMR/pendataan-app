export interface RiwayatWarga {
  judul: string
  aktor: string
  tanggal: string
}

export interface WargaRecord {
  id: string
  nik: string
  noKk: string
  namaLengkap: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  agama: string
  statusPerkawinan: string
  pekerjaan: string
  kewarganegaraan: string
  alamat: string
  rt: string
  rw: string
  dusun: string
  statusWarga: string
  createdAt: string
  updatedAt: string
  riwayat: RiwayatWarga[]
}

export type WargaPayload = Omit<WargaRecord, 'id' | 'createdAt' | 'updatedAt' | 'riwayat'>
export interface WargaList {
  items: WargaRecord[]
  total: number
  perPage: number
  page: number
}

export interface SuratUpload {
  nama: string
  base64: string
}

export interface KematianRecord {
  id: string
  wargaId: string | null
  namaAlmarhum: string
  nikAlmarhum: string
  rt: string
  rw: string
  tanggalMeninggal: string
  tempatMeninggal: string
  namaPelapor: string
  hubunganPelapor: string
  noHpPelapor: string
  catatan: string
  status: 'Menunggu' | 'Terverifikasi'
  suratNama: string | null
  createdAt: string
  updatedAt: string
}

export interface KematianPayload {
  wargaId: string | null
  tanggalMeninggal: string
  tempatMeninggal: string
  namaPelapor: string
  hubunganPelapor: string
  noHpPelapor: string
  catatan: string
  surat?: SuratUpload | null
  status?: 'Menunggu' | 'Terverifikasi'
}

export interface StatItem {
  label: string
  value: string
  caption: string
  icon: string
}

export interface KematianList {
  items: KematianRecord[]
  stats: StatItem[]
}

export interface RekapRw {
  rw: string
  kk: number
  wargaCount: number
  l: number
  p: number
  meninggal: number
}

export interface LaporanResponse {
  periode: string
  periodeLabel: string
  periodeOptions: { value: string; label: string }[]
  stats: { totalWarga: number; kematian: number; diperbarui: number; baru: number }
  rekap: RekapRw[]
  total: RekapRw
}

export interface DashboardResponse {
  stats: StatItem[]
  grafik: { label: string; value: number }[]
  aktivitas: { judul: string; sub: string; waktu: string }[]
}
