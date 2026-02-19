
export enum Role {
  ADMIN = 'ADMIN',
  PEGAWAI = 'PEGAWAI'
}

export enum AttendanceType {
  MASUK = 'Masuk',
  PULANG = 'Pulang',
  DINAS_LUAR = 'Dinas Luar',
  KENEGARAAN = 'Kenegaraan'
}

export interface User {
  id: string;
  username: string;
  name: string;
  nip: string;
  role: Role;
  institutionId: string;
  position: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  name: string;
  nip: string;
  date: string;
  type: AttendanceType;
  time: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'Hadir' | 'Dinas Luar' | 'Telat' | 'Manual';
}

export interface LHKPRecord {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  activity: string;
  photo: string;
  verified: boolean;
}

export interface SKPRecord {
  id: string;
  userId: string;
  target: string;
  achievement: string;
  period: string;
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  leader: string;
  nip: string;
  logo: string;
}

export interface BerAKHLAKReview {
  id: string;
  reviewerId: string;
  revieweeId: string;
  date: string;
  scores: {
    berorientasiPelayanan: number;
    akuntabel: number;
    kompeten: number;
    harmonis: number;
    loyal: number;
    adaptif: number;
    kolaboratif: number;
  };
}
