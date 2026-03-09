import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, DatePicker, Button, Select } from "zmp-ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getRevenueReport, RevenueData } from "../../../services/report-service";

const COLORS = ['#283b91', '#d32829', '#E53935', '#0088FE'];

const RevenuePage: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getRevenueReport(startDate, endDate);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="text-6xl mb-4">📊</div>
      <Text>Không có dữ liệu cho khoảng thời gian này</Text>
    </div>
  );

  return (
    <Page className="bg-gray-50 pb-10">
      <Header title="Báo cáo doanh thu" />
      
      <Box className="bg-white p-4 mb-4">
        <Text.Title size="small" className="mb-3 font-bold">Bộ lọc</Text.Title>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Text size="xSmall" className="text-gray-500 mb-1">Từ ngày</Text>
            <DatePicker 
              value={startDate} 
              onChange={(v, d) => d && setStartDate(d)} 
              dateFormat="dd/mm/yyyy"
            />
          </div>
          <div>
            <Text size="xSmall" className="text-gray-500 mb-1">Đến ngày</Text>
            <DatePicker 
              value={endDate} 
              onChange={(v, d) => d && setEndDate(d)} 
              dateFormat="dd/mm/yyyy"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
           <Button 
             size="small" 
             variant={chartType === 'bar' ? 'primary' : 'secondary'}
             onClick={() => setChartType('bar')}
           >
             Biểu đồ cột
           </Button>
           <Button 
             size="small" 
             variant={chartType === 'pie' ? 'primary' : 'secondary'}
             onClick={() => setChartType('pie')}
           >
             Biểu đồ tròn
           </Button>
        </div>
      </Box>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <Text size="xSmall" className="text-gray-500">Tổng doanh thu</Text>
          <Text.Title className="text-primary mt-1">{formatCurrency(totalRevenue)}</Text.Title>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <Text size="xSmall" className="text-gray-500">Tổng lượt đặt</Text>
          <Text.Title className="text-blue-600 mt-1">{totalBookings}</Text.Title>
        </div>
      </div>

      {/* Chart Section */}
      <Box className="bg-white p-4 rounded-xl mx-4 shadow-sm min-h-[300px]">
        <Text.Title size="small" className="mb-4 font-bold">Biểu đồ tăng trưởng</Text.Title>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} tickFormatter={(value) => `${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{color: '#333'}}
                  />
                  <Bar dataKey="revenue" fill="#283b91" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="date"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </Box>
    </Page>
  );
};

export default RevenuePage;
