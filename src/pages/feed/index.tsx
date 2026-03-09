import React, { useEffect, useRef, useState } from "react";
import { Page, Box, Text, Button, Icon, Modal, Input, useSnackbar } from "zmp-ui";

type VideoItem = {
  id: string;
  src: string;
  caption: string;
  user: string;
  avatar: string;
  likes: number;
  comments: number;
  saved: boolean;
};

const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "Khoảnh khắc bứt tốc làm chủ trận đấu!",
    user: "@User1",
    avatar: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 12500,
    comments: 432,
    saved: false,
  },
  {
    id: "v2",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "Pha xử lý kỹ thuật tinh tế qua người.",
    user: "@User2",
    avatar: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 9800,
    comments: 210,
    saved: false,
  },
  {
    id: "v3",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    caption: "Đường chuyền quyết định chiến thắng.",
    user: "@User3",
    avatar: "https://images.pexels.com/photos/159110/soccer-ball-football-ball-sport-159110.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 15200,
    comments: 389,
    saved: true,
  },
  {
    id: "v4",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    caption: "Highlight tổng hợp – cảm xúc vỡ òa!",
    user: "@User4",
    avatar: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=600",
    likes: 20100,
    comments: 512,
    saved: false,
  },
];

const FeedPage: React.FC = () => {
  const { openSnackbar } = useSnackbar();
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [commentModal, setCommentModal] = useState<{ open: boolean; videoId?: string }>({ open: false });
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement;
          const vid = target.dataset.videoId;
          if (!vid) return;
          const video = videoRefs.current[vid];
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.0, 0.25, 0.75, 1.0] }
    );
    const items = Array.from(el.querySelectorAll("[data-video-id]"));
    items.forEach((item) => io.observe(item));
    return () => {
      items.forEach((item) => io.unobserve(item));
      io.disconnect();
    };
  }, []);

  const toggleLike = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, likes: v.likes + (v.likes % 2 === 0 ? 1 : -1) } : v))
    );
  };
  const toggleSave = (id: string) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, saved: !v.saved } : v)));
  };
  const openComments = (id: string) => {
    setCommentText("");
    setCommentModal({ open: true, videoId: id });
  };
  const submitComment = () => {
    if (!commentModal.videoId || !commentText.trim()) {
      openSnackbar({ text: "Nhập bình luận trước khi gửi", type: "warning" });
      return;
    }
    setVideos((prev) =>
      prev.map((v) => (v.id === commentModal.videoId ? { ...v, comments: v.comments + 1 } : v))
    );
    setCommentText("");
    openSnackbar({ text: "Đã gửi bình luận", type: "success" });
  };
  const shareVideo = async (id: string) => {
    const link = `${location.origin}/?v=${id}`;
    try {
      // @ts-ignore
      if (navigator.share) {
        // @ts-ignore
        await navigator.share({ title: "Chia sẻ video", url: link });
      } else {
        await navigator.clipboard.writeText(link);
        openSnackbar({ text: "Đã sao chép link video", type: "success" });
      }
    } catch {
      await navigator.clipboard.writeText(link);
      openSnackbar({ text: "Đã sao chép link video", type: "success" });
    }
  };

  return (
    <Page className="bg-black text-white h-[100dvh] overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory pb-32"
      >
        {videos.map((item) => (
          <div
            key={item.id}
            data-video-id={item.id}
            className="snap-center h-[100dvh] relative"
          >
            <video
              ref={(el) => (videoRefs.current[item.id] = el)}
              src={item.src}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              onError={() =>
                setVideos((prev) =>
                  prev.map((v) =>
                    v.id === item.id
                      ? { ...v, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
                      : v
                  )
                )
              }
            />

            <Box className="absolute right-4 bottom-40 flex flex-col items-center gap-5 z-40">
              <Box className="flex flex-col items-center gap-1">
                <Button
                  size="small"
                  className="rounded-full w-12 h-12 min-w-0 p-0 bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center"
                  onClick={() => toggleLike(item.id)}
                >
                  <Icon icon="zi-heart" className="text-2xl text-white" />
                </Button>
                <Text className="text-[12px] text-white/90">
                  {new Intl.NumberFormat("en-US").format(item.likes)}
                </Text>
              </Box>

              <Box className="flex flex-col items-center gap-1">
                <Button
                  size="small"
                  className="rounded-full w-12 h-12 min-w-0 p-0 bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center"
                  onClick={() => openComments(item.id)}
                >
                  <Icon icon="zi-comment" className="text-2xl text-white" />
                </Button>
                <Text className="text-[12px] text-white/90">
                  {new Intl.NumberFormat("en-US").format(item.comments)}
                </Text>
              </Box>

              <Box className="flex flex-col items-center gap-1">
                <Button
                  size="small"
                  className={`rounded-full w-12 h-12 min-w-0 p-0 backdrop-blur border flex items-center justify-center ${
                    item.saved ? "bg-green-500 border-green-400" : "bg-black/40 border-white/20"
                  }`}
                  onClick={() => toggleSave(item.id)}
                >
                  <Icon icon="zi-bookmark" className="text-2xl text-white" />
                </Button>
                <Text className="text-[12px] text-white/90">
                  {item.saved ? "Đã lưu" : "Lưu"}
                </Text>
              </Box>

              <Box className="flex flex-col items-center gap-1">
                <Button
                  size="small"
                  className="rounded-full w-12 h-12 min-w-0 p-0 bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center"
                  onClick={() => shareVideo(item.id)}
                >
                  <Icon icon="zi-share" className="text-2xl text-white" />
                </Button>
                <Text className="text-[12px] text-white/90">Chia sẻ</Text>
              </Box>
            </Box>

            <Box className="absolute left-4 right-20 bottom-24 z-40">
              <Box className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.avatar})` }}
                  />
                </div>
                <Box>
                  <Text className="text-sm font-semibold">{item.user}</Text>
                  <Text className="text-[11px] text-white/80">
                    Original Audio · Champion Mindset
                  </Text>
                </Box>
              </Box>
              <Text className="text-[13px] text-white/90">{item.caption}</Text>
            </Box>
          </div>
        ))}
      </div>

      <Modal
        visible={commentModal.open}
        title="Bình luận"
        onClose={() => setCommentModal({ open: false })}
        actions={[
          {
            text: "Gửi",
            highLight: true,
            onClick: submitComment,
          },
        ]}
      >
        <div className="space-y-3">
          <Input
            placeholder="Viết bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Text size="xSmall" className="text-gray-400">
            Demo: tăng số bình luận sau khi gửi
          </Text>
        </div>
      </Modal>
    </Page>
  );
};

export default FeedPage;
