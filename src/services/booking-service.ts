import { supabase } from './supabase';
import { wait } from "../utils/async";

export type BookingType = 'single' | 'group' | 'event';

export interface TimeSlot {
  id: string;
  time: string; // "06:00", "07:00"
  isBooked: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  date: string; // YYYY-MM-DD
  slots: string[]; // List of slot IDs
  type: BookingType;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  eventName?: string; // For event booking
  participants?: number; // For group booking
  createdAt?: string;
  // Join fields
  user_details?: {
    display_name: string;
    phone_number: string;
  };
}

const TABLE_NAME = 'bookings';

export const BookingService = {
  // Get all bookings (Admin)
  getAllBookings: async (): Promise<Booking[]> => {
    // 1. Get bookings first
    const { data: bookingsData, error: bookingsError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error("Get all bookings error:", bookingsError);
      return [];
    }

    if (!bookingsData || bookingsData.length === 0) {
      return [];
    }

    // 2. Get user IDs
    const userIds = [...new Set(bookingsData.map((b: any) => b.user_id).filter((id: any) => id))];

    // 3. Get users info
    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('VJD')
        .select('id, display_name, phone_number')
        .in('id', userIds);
      
      if (!usersError && usersData) {
        usersData.forEach((u: any) => {
          usersMap[String(u.id)] = u;
        });
      }
    }

    return bookingsData.map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      courtId: b.court_id,
      date: b.date,
      slots: typeof b.slots === 'string' ? JSON.parse(b.slots) : b.slots,
      type: b.type,
      totalPrice: b.total_price,
      status: b.status,
      eventName: b.event_name,
      participants: b.participants,
      createdAt: b.created_at,
      user_details: usersMap[String(b.user_id)] ? {
        display_name: usersMap[String(b.user_id)].display_name,
        phone_number: usersMap[String(b.user_id)].phone_number
      } : undefined
    }));
  },

  // Get bookings by user
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    
    return data.map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      courtId: b.court_id,
      date: b.date,
      slots: typeof b.slots === 'string' ? JSON.parse(b.slots) : b.slots,
      type: b.type,
      totalPrice: b.total_price,
      status: b.status,
      eventName: b.event_name,
      participants: b.participants,
      createdAt: b.created_at
    }));
  },

  // Create booking
  createBooking: async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking | null> => {
    const parsedUserId = Number(booking.userId);
    const dbBooking: any = {
      user_id: Number.isFinite(parsedUserId) ? parsedUserId : null,
      court_id: booking.courtId,
      date: booking.date,
      // Insert as JSON array to match jsonb column type
      slots: booking.slots,
      total_price: booking.totalPrice,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(dbBooking)
      .select()
      .single();

    if (error) {
      console.error("Create booking error:", error);
      return null;
    }

    return {
      ...booking,
      id: data.id,
      status: data.status,
      createdAt: data.created_at
    };
  },

  // Update booking status
  updateStatus: async (id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get available slots (Legacy support + Real check)
  getAvailableSlots: async (date: string, courtId: string): Promise<TimeSlot[]> => {
    // Get confirmed bookings for this date and court
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('slots')
      .eq('date', date)
      .eq('court_id', courtId)
      .neq('status', 'cancelled');

    let bookedSlots: string[] = [];
    if (data) {
      data.forEach((b: any) => {
        const s = typeof b.slots === 'string' ? JSON.parse(b.slots) : b.slots;
        bookedSlots = [...bookedSlots, ...s];
      });
    }

    // Generate slots 06:00 - 22:00
    const slots: TimeSlot[] = [];
    for (let i = 6; i <= 22; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`;
      const id = `slot-${i}`;
      slots.push({
        id,
        time,
        isBooked: bookedSlots.includes(time), // Check by time, not ID
        price: 50000 // Base price
      });
      
      if (i < 22) {
         const timeHalf = `${i.toString().padStart(2, '0')}:30`;
         const idHalf = `slot-${i}-30`;
         slots.push({
            id: idHalf,
            time: timeHalf,
            isBooked: bookedSlots.includes(timeHalf), // Check by time, not ID
            price: 50000
         });
      }
    }
    return slots;
  }
};

// Export legacy function for compatibility if needed, but redirects to Service
export const getAvailableSlots = BookingService.getAvailableSlots;
export const createBooking = BookingService.createBooking;
