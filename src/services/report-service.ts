import { supabase } from './supabase';

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export const getRevenueReport = async (startDate: Date, endDate: Date): Promise<RevenueData[]> => {
  // Ensure we cover the full day range
  const startIso = startDate.toISOString();
  const endIso = new Date(endDate.getTime() + 86400000).toISOString(); // Add 1 day to cover end date fully if needed, or just set time to 23:59:59

  const { data, error } = await supabase
    .from('bookings')
    .select('total_price, created_at')
    .gte('created_at', startIso)
    .lte('created_at', endIso);

  if (error) {
    console.error('Error fetching revenue report:', error);
    return [];
  }

  // Process data
  const revenueMap = new Map<string, { revenue: number, bookings: number }>();

  // Initialize map with all dates in range to ensure continuity
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    revenueMap.set(dateKey, { revenue: 0, bookings: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  (data || []).forEach((booking: any) => {
    const date = new Date(booking.created_at);
    const dateKey = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    
    if (revenueMap.has(dateKey)) {
      const current = revenueMap.get(dateKey)!;
      revenueMap.set(dateKey, {
        revenue: current.revenue + (Number(booking.total_price) || 0),
        bookings: current.bookings + 1
      });
    }
  });

  return Array.from(revenueMap.entries()).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    bookings: stats.bookings
  }));
};
