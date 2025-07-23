export type HoneycombProfile = {
  address: string;
  project: string;
  userId: number;
  info: ProfileInfo;
  platformData: PlatformData;
}

export type PlatformData = {
  xp: number;
  achievements: number[];
}

export type ProfileInfo = {
  name: string | null;
  bio: string | null;
  pfp: string | null;
}