import { supabase } from './supabase';

export interface PackageCategory {
  id: string;
  name: string;
}

export interface Package {
  id: string;
  categoryId: string;
  name: string;
  durationMonths: number;
  originalPrice: number;
  currentPrice: number;
  image: string;
  banner?: string;
  description?: string;
  isHot?: boolean;
  saleBadge?: string; // e.g. "50%"
}

const TABLE_NAME = 'packages';

// Fixed categories for now, or we can move to DB too.
// For simplicity, let's keep categories static or fetch distinct from DB.
// But better to have a static list or a simple mapping.
const CATEGORIES: PackageCategory[] = [
  { id: 'gym', name: 'Gym' },
  { id: 'groupx', name: 'GroupX' },
  { id: 'yoga', name: 'Yoga' },
  { id: 'boxing', name: 'Boxing' }
];

export const PackageService = {
  getCategories: async (): Promise<PackageCategory[]> => {
    return Promise.resolve(CATEGORIES);
  },

  getAllPackages: async (): Promise<Package[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching packages:', error);
      return [];
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      categoryId: p.category_id,
      name: p.name,
      durationMonths: p.duration_months,
      originalPrice: p.original_price,
      currentPrice: p.current_price,
      image: p.image,
      banner: p.banner,
      description: p.description,
      isHot: p.is_hot,
      saleBadge: p.sale_badge
    }));
  },

  getPackageById: async (id: string): Promise<Package | null> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching package by id:', error);
      return null;
    }

    const p = data;
    return {
      id: p.id,
      categoryId: p.category_id,
      name: p.name,
      durationMonths: p.duration_months,
      originalPrice: p.original_price,
      currentPrice: p.current_price,
      image: p.image,
      banner: p.banner,
      description: p.description,
      isHot: p.is_hot,
      saleBadge: p.sale_badge
    };
  },

  createPackage: async (pkg: Omit<Package, 'id'>): Promise<Package | null> => {
    const dbPkg = {
      category_id: pkg.categoryId,
      name: pkg.name,
      duration_months: pkg.durationMonths,
      original_price: pkg.originalPrice,
      current_price: pkg.currentPrice,
      image: pkg.image,
      banner: pkg.banner,
      description: pkg.description,
      is_hot: pkg.isHot,
      sale_badge: pkg.saleBadge
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(dbPkg)
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating package:', error);
      return null;
    }

    const p = data;
    return {
      id: p.id,
      categoryId: p.category_id,
      name: p.name,
      durationMonths: p.duration_months,
      originalPrice: p.original_price,
      currentPrice: p.current_price,
      image: p.image,
      banner: p.banner,
      description: p.description,
      isHot: p.is_hot,
      saleBadge: p.sale_badge
    };
  },

  updatePackage: async (id: string, pkg: Partial<Package>): Promise<boolean> => {
    const dbPkg: any = {};
    if (pkg.categoryId !== undefined) dbPkg.category_id = pkg.categoryId;
    if (pkg.name !== undefined) dbPkg.name = pkg.name;
    if (pkg.durationMonths !== undefined) dbPkg.duration_months = pkg.durationMonths;
    if (pkg.originalPrice !== undefined) dbPkg.original_price = pkg.originalPrice;
    if (pkg.currentPrice !== undefined) dbPkg.current_price = pkg.currentPrice;
    if (pkg.image !== undefined) dbPkg.image = pkg.image;
    if (pkg.banner !== undefined) dbPkg.banner = pkg.banner;
    if (pkg.description !== undefined) dbPkg.description = pkg.description;
    if (pkg.isHot !== undefined) dbPkg.is_hot = pkg.isHot;
    if (pkg.saleBadge !== undefined) dbPkg.sale_badge = pkg.saleBadge;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(dbPkg)
      .eq('id', id);

    if (error) {
      console.error('Error updating package:', error);
      return false;
    }
    return true;
  },

  deletePackage: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting package:', error);
      return false;
    }
    return true;
  }
};
