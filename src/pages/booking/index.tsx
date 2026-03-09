import React, { useEffect, useMemo, useState } from "react";
import { Page, Header, Box, Text, Button, Icon, Input } from "zmp-ui";
import { useNavigate, useLocation } from "react-router-dom";
import { ClubService, Club } from "../../services/club-service";
import { CourtService, Court } from "../../services/court-service";
import { BookingMethodModal } from "../../components/booking-method-modal";
import { BookingService, TimeSlot } from "../../services/booking-service";

const chips = ["Tất cả", "Pickleball", "Tennis", "Cầu lông"];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const selectedMode: "daily" | "fixed" | "event" | "visual" | undefined = navState.mode;
  const selectedClubName: string | undefined = navState.clubName;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [courtsMap, setCourtsMap] = useState<Record<string, Court[]>>({});
  const [activeChip, setActiveChip] = useState("Tất cả");
  const [keyword, setKeyword] = useState("");
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [modalClub, setModalClub] = useState<string>("");

  // Selection mode states (chọn sân/khung giờ)
  const [selectionCourts, setSelectionCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState<string>("");
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  });
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    ClubService.getAllClubs().then(async (data) => {
      setClubs(data);
      const map: Record<string, Court[]> = {};
      await Promise.all(
        data.map(async (c) => {
          const courts = await CourtService.getCourtsByClub(c.id);
          map[c.id] = courts;
        })
      );
      setCourtsMap(map);
    });
  }, []);

  // Load selection courts when navigated with mode (except visual which has its own page)
  useEffect(() => {
    const loadSelectionCourts = async () => {
      if (!selectedMode || selectedMode === "visual" || !selectedClubName) return;
      const allClubs = await ClubService.getAllClubs();
      const club = allClubs.find((c) => c.name === selectedClubName);
      if (!club) return;
      const courts = await CourtService.getCourtsByClub(club.id);
      setSelectionCourts(courts);
      if (courts.length > 0) {
        setSelectedCourtId(courts[0].id);
      }
    };
    loadSelectionCourts();
  }, [selectedMode, selectedClubName]);

  // Load available slots when court/date changes (selection view)
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedMode || selectedMode === "visual") return;
      if (!selectedCourtId || !date) return;
      setLoadingSlots(true);
      const s = await BookingService.getAvailableSlots(date, selectedCourtId);
      setSlots(s);
      setSelectedTimes([]);
      setLoadingSlots(false);
    };
    loadSlots();
  }, [selectedMode, selectedCourtId, date]);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const kw =
        keyword.trim().length > 0
          ? c.name.toLowerCase().includes(keyword.toLowerCase()) ||
            c.address.toLowerCase().includes(keyword.toLowerCase())
          : true;
      let chipOk = true;
      if (activeChip !== "Tất cả") {
        const label = activeChip.toLowerCase();
        chipOk =
          c.name.toLowerCase().includes(label) ||
          (c.tags || []).some((t) => (t || "").toLowerCase().includes(label));
      }
      return kw && chipOk;
    });
  }, [clubs, keyword, activeChip]);

  const getMinPrice = (clubId: string) => {
    const courts = courtsMap[clubId] || [];
    if (courts.length === 0) return "—";
    const min = Math.min(...courts.map((c) => c.pricePerHour || 0).filter((v) => v > 0));
    if (!Number.isFinite(min) || min <= 0) return "—";
    return `${new Intl.NumberFormat("vi-VN").format(min)}đ`;
  };

  const hasAvailableCourt = (clubId: string) => {
    const courts = courtsMap[clubId] || [];
    return courts.some((c) => c.status === "active");
  };

  const handleBookNow = (clubName: string) => {
    setModalClub(clubName);
    setShowMethodModal(true);
  };

  const toggleTime = (time: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const totalPrice = useMemo(() => {
    const priceMap = new Map(slots.map((s) => [s.time, s.price]));
    return selectedTimes.reduce((sum, t) => sum + (priceMap.get(t) || 0), 0);
  }, [selectedTimes, slots]);

  const handleNext = () => {
    if (selectedMode === "visual") {
      navigate("/booking/visual", { state: { clubName: selectedClubName, mode: "visual" } });
      return;
    }
    if (!selectedCourtId || selectedTimes.length === 0) return;
    const courtName =
      selectionCourts.find((c) => c.id === selectedCourtId)?.name || "Sân";
    const builtSlots = selectedTimes
      .sort((a, b) => a.localeCompare(b))
      .map((t) => ({
        id: `${selectedCourtId}-${t}`,
        court: courtName,
        time: t,
        price: slots.find((s) => s.time === t)?.price || 0,
      }));
    navigate("/booking-summary", {
      state: {
        clubName: selectedClubName || "Câu lạc bộ",
        date,
        slots: builtSlots,
        mode: selectedMode || "daily",
        total: totalPrice,
      },
    });
  };

  const isSelectionView = !!selectedMode && selectedMode !== "visual";

  return (
    <Page className="bg-white pb-20">
      <Header title={isSelectionView ? "Chọn sân & khung giờ" : "Danh sách Câu lạc bộ"} />

      <Box className="p-4 space-y-3">
        {!isSelectionView ? (
          <>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm CLB, khu vực..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-gray-50 rounded-xl"
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <Icon icon="zi-tune" />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {chips.map((c) => (
                <button
                  key={c}
                  className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                    activeChip === c ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setActiveChip(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map((club) => (
                <Box key={club.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="relative">
                    <div
                      className="h-44 bg-cover bg-center"
                      style={{ backgroundImage: `url(${club.image || "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600"})` }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Icon icon="zi-star-solid" className="text-yellow-500" />
                      <span>{club.rating?.toFixed?.(1) || club.rating || "4.5"}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <Text.Title size="small" className="font-bold">{club.name}</Text.Title>
                      {hasAvailableCourt(club.id) && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">
                          CÒN SÂN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Icon icon="zi-location" className="mr-1 text-red-500" />
                      <span className="line-clamp-1">{club.address}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <Text size="xSmall" className="text-gray-500">Từ</Text>{" "}
                        <span className="font-bold text-[#283b91]">{getMinPrice(club.id)}</span>{" "}
                        <Text size="xSmall" className="text-gray-500">/ giờ</Text>
                      </div>
                      <Button
                        size="small"
                        className="bg-green-600 text-white font-bold rounded-full px-4 py-2 shadow active:scale-95 transition-transform"
                        onClick={() => handleBookNow(club.name)}
                      >
                        Đặt ngay
                      </Button>
                    </div>
                  </div>
                </Box>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-gray-500 py-10">Không tìm thấy CLB phù hợp</div>
              )}
            </div>
          </>
        ) : (
          <>
            <Box className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="zi-location" className="text-[#d32829]" />
                <Text className="font-bold text-[#d32829]">Thông tin sân</Text>
              </div>
              <Text className="font-medium mb-1">Tên CLB: {selectedClubName}</Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <Text size="xSmall" className="text-gray-500 mb-1">Chọn sân</Text>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white outline-none"
                    value={selectedCourtId}
                    onChange={(e) => setSelectedCourtId(e.target.value)}
                  >
                    {selectionCourts.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Text size="xSmall" className="text-gray-500 mb-1">Chọn ngày</Text>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </Box>

            <Box className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="zi-calendar" className="text-[#d32829]" />
                <Text className="font-bold text-[#d32829]">Khung giờ trống</Text>
              </div>
              {loadingSlots ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#283b91]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {slots.map((s) => {
                    const disabled = s.isBooked;
                    const selected = selectedTimes.includes(s.time);
                    const cls = disabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : selected
                      ? "bg-[#283b91] text-white shadow-md scale-95 transition-transform"
                      : "bg-white text-gray-700 border border-gray-200 shadow-sm active:bg-gray-100";
                    return (
                      <div
                        key={s.id}
                        className={`py-2 text-center rounded-lg text-xs font-bold cursor-pointer ${cls}`}
                        onClick={() => toggleTime(s.time, disabled)}
                      >
                        {s.time}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-white border border-gray-200 rounded"></span>
                  <span>Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-200 rounded"></span>
                  <span>Đã đặt</span>
                </div>
              </div>
            </Box>

            <Box className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="zi-poll" className="text-[#d32829]" />
                <Text className="font-bold text-[#d32829]">Tổng kết</Text>
              </div>
              <div className="flex justify-between text-sm">
                <Text>Tổng giờ: {selectedTimes.length}</Text>
                <Text className="font-bold text-[#283b91]">
                  {new Intl.NumberFormat("vi-VN").format(totalPrice)} đ
                </Text>
              </div>
            </Box>

            <div className="p-4 bg-[#283b91] fixed left-0 right-0 bottom-16 z-50">
              <Button
                fullWidth
                className="bg-[#d32829] text-white font-bold rounded-lg"
                onClick={handleNext}
                disabled={selectedTimes.length === 0 || !selectedCourtId}
              >
                TIẾP THEO
              </Button>
            </div>
          </>
        )}
      </Box>

      {!isSelectionView && (
        <BookingMethodModal
          visible={showMethodModal}
          onClose={() => setShowMethodModal(false)}
          clubName={modalClub}
        />
      )}
    </Page>
  );
};

export default BookingPage;
