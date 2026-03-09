import React, { useEffect, useState } from "react";
import { Page, Header, Text, Icon, Button, Box, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

const sportCategories = [
  { id: "1", name: "Pickleball", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "2", name: "Cầu lông", color: "text-green-600", bg: "bg-green-50" },
  { id: "3", name: "Bóng đá", color: "text-green-700", bg: "bg-green-50" },
  { id: "4", name: "Tennis", color: "text-orange-600", bg: "bg-orange-50" },
  { id: "5", name: "B.Chuyền", color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "6", name: "Bóng rổ", color: "text-red-600", bg: "bg-red-50" },
  { id: "7", name: "Phức hợp", color: "text-pink-600", bg: "bg-pink-50" },
  { id: "8", name: "Golf", color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "9", name: "Padel", color: "text-teal-600", bg: "bg-teal-50" },
];

const provinces = [
  { id: "hcm", name: "TP. HCM", districts: ["Quận 1", "Quận 7", "Nhà Bè", "Thủ Đức"] },
  { id: "hn", name: "Hà Nội", districts: ["Cầu Giấy", "Hoàn Kiếm", "Long Biên"] },
];

const quickKeywords = ["Cầu lông gần tôi", "Pickleball gần tôi", "Xé vé gần tôi"];

const SearchAdvancedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<"daily" | "event" | "team" | null>(null);
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);
  const [keywords, setKeywords] = useState<string[]>([]);

  const toggleSport = (id: string) => {
    setSelectedSports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleKeyword = (kw: string) => {
    setKeywords((prev) => (prev.includes(kw) ? prev.filter((x) => x !== kw) : [...prev, kw]));
  };

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setDistrict("");
  };

  const resetAllSports = () => {
    setSelectedSports([]);
  };

  useEffect(() => {
    const preset = (location.state as any)?.preset;
    if (preset?.categoryId) {
      setSelectedSports(preset.categoryId ? [preset.categoryId] : []);
    }
    if (preset?.keyword) {
      setKeywords(preset.keyword ? [preset.keyword] : []);
    }
  }, [location.state]);

  const performSearch = () => {
    const filters = {
      selectedSports,
      bookingType,
      province,
      district,
      distance,
      keywords,
    };
    navigate("/", { state: { advancedSearch: filters } });
  };

  const currentDistricts =
    provinces.find((p) => p.id === province)?.districts || [];

  return (
    <Page className="bg-[#eef2ff] min-h-full pb-24">
      <Header title="Tìm kiếm" showBackIcon textColor="white" className="bg-[#283b91]" />

      <Box className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Text.Title className="text-[#283b91]">Môn thể thao</Text.Title>
          <Button
            size="small"
            className="bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1"
            onClick={resetAllSports}
          >
            + Tất cả
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {sportCategories.map((cat) => {
            const active = selectedSports.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleSport(cat.id)}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-all ${
                  active
                    ? "bg-[#283b91] text-white border-[#283b91]"
                    : `bg-white text-gray-700 border-gray-200`
                }`}
              >
                {cat.name}
              </div>
            );
          })}
        </div>

        <Text.Title className="text-[#283b91] mb-2">Loại lịch</Text.Title>
        <div className="flex gap-2 mb-6">
          {[
            { id: "daily", label: "Sân trống" },
            { id: "event", label: "Sự kiện / Xé vé" },
            { id: "team", label: "Ghép đội" },
          ].map((t) => (
            <div
              key={t.id}
              onClick={() => setBookingType(bookingType === t.id ? null : (t.id as any))}
              className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                bookingType === t.id
                  ? "bg-[#283b91] text-white border-[#283b91]"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {t.label}
            </div>
          ))}
        </div>

        <Text.Title className="text-[#283b91] mb-2">Khu vực</Text.Title>
        <div className="flex items-center gap-2 mb-6">
          <select
            className="flex-1 p-2 border rounded-lg bg-white"
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">Tỉnh/TP</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            className="flex-1 p-2 border rounded-lg bg-white"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!province}
          >
            <option value="">Quận/Huyện</option>
            {currentDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <Button className="rounded-lg" onClick={() => {}}>
            <Icon icon="zi-heart" />
          </Button>
        </div>

        <Text.Title className="text-[#283b91] mb-2">Khoảng cách</Text.Title>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="range"
            min={0}
            max={30}
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className="flex-1"
          />
          <Text>{distance} km</Text>
        </div>

        <Text.Title className="text-[#283b91] mb-2">Từ khoá</Text.Title>
        <div className="flex flex-wrap gap-2 mb-10">
          {quickKeywords.map((kw) => {
            const active = keywords.includes(kw);
            return (
              <div
                key={kw}
                onClick={() => toggleKeyword(kw)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                  active
                    ? "bg-[#283b91] text-white border-[#283b91]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {kw}
              </div>
            );
          })}
        </div>
      </Box>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
        <Button fullWidth className="bg-[#283b91] rounded-lg py-3 font-bold" onClick={performSearch}>
          Tìm kiếm
        </Button>
      </div>
    </Page>
  );
};

export default SearchAdvancedPage;
