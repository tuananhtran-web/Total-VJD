import { supabase } from './supabase';

export interface Club {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  openTime: string;
  address: string;
  type: 'daily' | 'event';
  categoryId: string;
  tags?: string[];
  priceRange?: string;
  services?: string[];
  description?: string;
  images?: string[];
  reviews?: any[];
  rules?: string[];
}

const TABLE_NAME = 'clubs';

export const ClubService = {
  getAllClubs: async (): Promise<Club[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*');

    if (error) {
      console.error("Get clubs error:", error);
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      rating: c.rating,
      distance: c.distance || '0km',
      openTime: c.open_time,
      address: c.address,
      type: c.type,
      categoryId: c.category_id,
      tags: c.tags,
      priceRange: c.price_range,
      services: c.services,
      description: c.description,
      images: c.images,
      reviews: c.reviews,
      rules: c.rules
    }));
  },

  createClub: async (club: Omit<Club, 'id'>): Promise<Club | null> => {
    const dbClub = {
      name: club.name,
      image: club.image,
      rating: club.rating,
      distance: club.distance,
      open_time: club.openTime,
      address: club.address,
      type: club.type,
      category_id: club.categoryId,
      tags: club.tags,
      price_range: club.priceRange,
      services: club.services,
      description: club.description,
      images: club.images,
      rules: club.rules
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(dbClub)
      .select()
      .single();

    if (error) {
      console.error("Create club error:", error);
      return null;
    }

    return { ...club, id: data.id };
  },

  updateClub: async (id: string, club: Partial<Club>): Promise<void> => {
    const dbClub: any = {};
    if (club.name !== undefined) dbClub.name = club.name;
    if (club.image !== undefined) dbClub.image = club.image;
    if (club.rating !== undefined) dbClub.rating = club.rating;
    if (club.distance !== undefined) dbClub.distance = club.distance;
    if (club.openTime !== undefined) dbClub.open_time = club.openTime;
    if (club.address !== undefined) dbClub.address = club.address;
    if (club.type !== undefined) dbClub.type = club.type;
    if (club.categoryId !== undefined) dbClub.category_id = club.categoryId;
    if (club.tags !== undefined) dbClub.tags = club.tags;
    if (club.priceRange !== undefined) dbClub.price_range = club.priceRange;
    if (club.services !== undefined) dbClub.services = club.services;
    if (club.description !== undefined) dbClub.description = club.description;
    if (club.images !== undefined) dbClub.images = club.images;
    if (club.rules !== undefined) dbClub.rules = club.rules;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(dbClub)
      .eq('id', id);
      
    if (error) {
      console.error("Update club error:", error);
      throw error;
    }
  },
  
  deleteClub: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Delete club error:", error);
      throw error;
    }
  }
};
