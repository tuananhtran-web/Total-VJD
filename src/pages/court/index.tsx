import React, { useState } from "react";
import { Page, Box, Text, Button, Icon, Input } from "zmp-ui";

interface Team {
  name: string;
  avatar: string;
  rank: number;
}

const teams: Team[] = [
  {
    name: "Team Alpha",
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
    rank: 12,
  },
  {
    name: "Team Bravo",
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg",
    rank: 15,
  },
  {
    name: "Team Charlie",
    avatar:
      "https://randomuser.me/api/portraits/men/55.jpg",
    rank: 8,
  },
  {
    name: "Team Delta",
    avatar:
      "https://randomuser.me/api/portraits/women/67.jpg",
    rank: 20,
  },
  {
    name: "Team Echo",
    avatar:
      "https://randomuser.me/api/portraits/men/89.jpg",
    rank: 5,
  },
  {
    name: "Team Foxtrot",
    avatar:
      "https://randomuser.me/api/portraits/women/12.jpg",
    rank: 18,
  },
  {
    name: "Team Golf",
    avatar:
      "https://randomuser.me/api/portraits/men/45.jpg",
    rank: 10,
  },
  {
    name: "Team Hotel",
    avatar:
      "https://randomuser.me/api/portraits/women/78.jpg",
    rank: 25,
  },
];

interface ChatMsg {
  id: number;
  user: string;
  text: string;
  time: string;
}

const initialChat: ChatMsg[] = [
  {
    id: 1,
    user: "Marcus_Pro",
    text: "Insane play from Team Alpha! That serve was unstoppable. 🔥",
    time: "2m ago",
  },
  {
    id: 2,
    user: "Sarah_K",
    text: "Anyone looking for a partner for the 17:00 slot?",
    time: "5m ago",
  },
];

const CourtPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>(initialChat);
  const [newMsg, setNewMsg] = useState("");
  const [currentMatch, setCurrentMatch] = useState<{
    team1: Team;
    team2: Team;
    score: string;
    duration: string;
    watchers: number;
  } | null>(null);

  const handleChallenge = () => {
    if (isSearching) return;
    setIsSearching(true);
    // simulate matchmaking delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * teams.length);
      const opponent = teams[randomIndex];
      const me = teams[currentIndex];
      setCurrentMatch({
        team1: me,
        team2: opponent,
        score: "00 - 00",
        duration: "00:00",
        watchers: Math.floor(Math.random() * 50) + 10,
      });
      setIsSearching(false);
    }, 1500);
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const nextId = chat.length + 1;
    setChat([
      ...chat,
      { id: nextId, user: "You", text: newMsg.trim(), time: "now" },
    ]);
    setNewMsg("");
  };

  const opponent = currentMatch ? currentMatch.team2 : teams[(currentIndex + 1) % teams.length];
  const me = currentMatch ? currentMatch.team1 : teams[currentIndex];

  return (
    <Page className="bg-[#050910] text-white min-h-screen flex flex-col">
      <Box className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold">Inside the Court</Text>
        <Text className="text-sm text-green-400">LIVE MATCH</Text>
      </Box>

      {/* match card */}
      <Box className="mx-4 rounded-3xl overflow-hidden relative bg-gradient-to-t from-black via-black/40 to-black/10 h-[35vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#2e6bb4_0,_#050910_55%)]" />
        <Box className="absolute inset-0 flex items-center justify-between px-8">
          {/* my team */}
          <Box className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${me.avatar})` }}
            />
            <Text className="font-semibold">{me.name}</Text>
            <Text className="text-xs text-green-400">Rank #{me.rank}</Text>
          </Box>
          {/* vs icon */}
          <Box className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center">
            <Text className="font-bold text-black">VS</Text>
          </Box>
          {/* opponent */}
          <Box className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${opponent.avatar})` }}
            />
            <Text className="font-semibold">{opponent.name}</Text>
            <Text className="text-xs text-green-400">
              Rank #{opponent.rank}
            </Text>
          </Box>
        </Box>

        {/* challenge button */}
        <Box className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Box className="text-center">
            <Text className="text-xs text-white/70 mb-2">Find a random opponent to challenge</Text>
            <Button
              className="bg-green-400 text-black rounded-full px-8 flex items-center justify-center gap-2"
              onClick={handleChallenge}
              disabled={isSearching}
            >
              {isSearching && <Icon icon="zi-loader" className="animate-spin" />}
              {isSearching ? "Searching..." : "Challenge Next"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* stats row */}
      <Box className="flex justify-around mt-4">
        <Box className="text-center">
          <Text className="text-xs text-green-400">DURATION</Text>
          <Text className="text-lg font-bold">{currentMatch ? currentMatch.duration : "00:00"}</Text>
        </Box>
        <Box className="text-center">
          <Text className="text-xs text-green-400">SCORE</Text>
          <Text className="text-lg font-bold">{currentMatch ? currentMatch.score : "00 - 00"}</Text>
        </Box>
        <Box className="text-center">
          <Text className="text-xs text-green-400">WATCHERS</Text>
          <Text className="text-lg font-bold">{currentMatch ? currentMatch.watchers : 0}</Text>
        </Box>
      </Box>

      {/* chat area */}
      <Box className="flex-1 flex flex-col px-4 mt-4 mb-2 overflow-y-auto">
        <Text className="font-semibold mb-2">Community Chat</Text>
        {chat.map((m) => (
          <Box
            key={m.id}
            className={`mb-2 p-2 rounded-lg ${
              m.user === "You" ? "bg-green-700 self-end" : "bg-black/40"
            }`}
          >
            <Text className="text-sm font-bold">{m.user}</Text>
            <Text className="text-[13px]">{m.text}</Text>
            <Text className="text-[10px] text-white/70">{m.time}</Text>
          </Box>
        ))}
      </Box>

      {/* input bar */}
      <Box className="px-4 pb-4 pt-2">
        <Box className="flex items-center gap-2">
          <Input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-black/30 text-white rounded-full px-4 py-2"
          />
          <Button
            className="bg-green-400 rounded-full w-10 h-10 min-w-0 p-0 flex items-center justify-center"
            onClick={sendMessage}
            disabled={!newMsg.trim()}
          >
            <Icon icon="zi-send" />
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default CourtPage;
