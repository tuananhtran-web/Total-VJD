import React, { useState } from "react";
import { Page, Box, Text, Button, Icon, useNavigate } from "zmp-ui";

interface LiveMatch {
  id: number;
  team1: { name: string; avatar: string; rank: number };
  team2: { name: string; avatar: string; rank: number };
  score: string;
  duration: string;
  watchers: number;
  sport: string;
}

const liveMatches: LiveMatch[] = [
  {
    id: 1,
    team1: { name: "Team Alpha", avatar: "https://randomuser.me/api/portraits/men/32.jpg", rank: 12 },
    team2: { name: "Team Bravo", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rank: 15 },
    score: "11 - 09",
    duration: "42:10",
    watchers: 24,
    sport: "Pickleball",
  },
  {
    id: 2,
    team1: { name: "Team Charlie", avatar: "https://randomuser.me/api/portraits/men/55.jpg", rank: 8 },
    team2: { name: "Team Delta", avatar: "https://randomuser.me/api/portraits/women/67.jpg", rank: 20 },
    score: "08 - 11",
    duration: "35:45",
    watchers: 18,
    sport: "Badminton",
  },
  {
    id: 3,
    team1: { name: "Team Echo", avatar: "https://randomuser.me/api/portraits/men/89.jpg", rank: 5 },
    team2: { name: "Team Foxtrot", avatar: "https://randomuser.me/api/portraits/women/12.jpg", rank: 18 },
    score: "15 - 13",
    duration: "50:20",
    watchers: 32,
    sport: "Pickleball",
  },
];

const CommunityCourtPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page className="bg-[#050910] text-white min-h-screen flex flex-col">
      <Box className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold">Community Court</Text>
        <Text className="text-sm text-green-400">Live Matches & Community</Text>
      </Box>

      {/* Live Matches List */}
      <Box className="flex-1 px-4">
        <Text className="font-semibold mb-4">Live Matches</Text>
        {liveMatches.map((match) => (
          <Box
            key={match.id}
            className="mb-4 p-4 rounded-2xl bg-black/40 backdrop-blur"
            onClick={() => navigate(`/pages/court/index`)} // Navigate to court page
          >
            <Box className="flex items-center justify-between mb-2">
              <Text className="text-sm text-green-400">{match.sport}</Text>
              <Text className="text-xs text-white/70">{match.watchers} watching</Text>
            </Box>
            <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${match.team1.avatar})` }} />
                <Box>
                  <Text className="font-semibold">{match.team1.name}</Text>
                  <Text className="text-xs text-green-400">Rank #{match.team1.rank}</Text>
                </Box>
              </Box>
              <Box className="text-center">
                <Text className="font-bold text-lg">{match.score}</Text>
                <Text className="text-xs text-white/70">{match.duration}</Text>
              </Box>
              <Box className="flex items-center gap-3">
                <Box className="text-right">
                  <Text className="font-semibold">{match.team2.name}</Text>
                  <Text className="text-xs text-green-400">Rank #{match.team2.rank}</Text>
                </Box>
                <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${match.team2.avatar})` }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box className="px-4 pb-4">
        <Box className="flex gap-2">
          <Button
            className="flex-1 bg-green-400 text-black rounded-full"
            onClick={() => navigate('/pages/create-match')}
          >
            Create Match
          </Button>
          <Button
            className="flex-1 bg-blue-400 text-white rounded-full"
            onClick={() => navigate('/pages/create-tournament')}
          >
            Create Tournament
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default CommunityCourtPage;