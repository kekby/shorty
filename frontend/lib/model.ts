export type LoginResponse = {
  userId: number;
  email: string;
};

export type Link = {
  code: string;
  original_url: string;
  created_at: string;
};

export type LinkWithClicks = Link & {
  clicks: number;
};

export type LinkStats = Link & {
  id: number;
  clicks: Array<{ clicked_at: string; referrer: string | null }>;
};
