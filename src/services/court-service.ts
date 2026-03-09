import { supabase } from './supabase';

export interface Court {
  id: string;
  clubId: string;
  name: string;
  pricePerHour: number;
  openTime: string;
  status: 'active' | 'inactive';
  images?: string[];
  createdAt?: string;
}

const TABLE_NAME = 'courts';

export const CourtService = {
  getAllCourts: async (): Promise<Court[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((c: any) => ({
      id: c.id,
      clubId: c.club_id,
      name: c.name,
      pricePerHour: c.price_per_hour,
      openTime: c.open_time,
      status: c.status,
      images: c.images,
      createdAt: c.created_at,
    }));
  },

  getCourtsByClub: async (clubId: string): Promise<Court[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []).map((c: any) => ({
      id: c.id,
      clubId: c.club_id,
      name: c.name,
      pricePerHour: c.price_per_hour,
      openTime: c.open_time,
      status: c.status,
      images: c.images,
      createdAt: c.created_at,
    }));
  },

  createCourt: async (court: Omit<Court, 'id' | 'createdAt'>): Promise<Court | null> => {
    const payload = {
      club_id: court.clubId,
      name: court.name,
      price_per_hour: court.pricePerHour,
      open_time: court.openTime,
      status: court.status,
      images: court.images || [],
    };
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      clubId: data.club_id,
      name: data.name,
      pricePerHour: data.price_per_hour,
      openTime: data.open_time,
      status: data.status,
      images: data.images,
      createdAt: data.created_at,
    };
  },

  updateCourt: async (id: string, court: Partial<Court>): Promise<void> => {
    const payload: any = {};
    if (court.clubId !== undefined) payload.club_id = court.clubId;
    if (court.name !== undefined) payload.name = court.name;
    if (court.pricePerHour !== undefined) payload.price_per_hour = court.pricePerHour;
    if (court.openTime !== undefined) payload.open_time = court.openTime;
    if (court.status !== undefined) payload.status = court.status;
    if (court.images !== undefined) payload.images = court.images;
    await supabase.from(TABLE_NAME).update(payload).eq('id', id);
  },

  deleteCourt: async (id: string): Promise<void> => {
    await supabase.from(TABLE_NAME).delete().eq('id', id);
  },
};

