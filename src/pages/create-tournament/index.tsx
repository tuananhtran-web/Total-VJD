import React, { useState } from "react";
import { Page, Box, Text, Button, Icon, Input, Select, useNavigate } from "zmp-ui";

const sports = [
  { value: "pickleball", label: "Pickleball" },
  { value: "badminton", label: "Badminton" },
  { value: "tennis", label: "Tennis" },
];

const formats = [
  { value: "single-elimination", label: "Single Elimination" },
  { value: "round-robin", label: "Round Robin" },
  { value: "league", label: "League" },
];

const CreateTournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    sport: "",
    format: "",
    maxTeams: "",
    startDate: "",
    description: "",
  });

  const handleSubmit = () => {
    // Simulate creating tournament
    alert("Tournament created! Navigating to community...");
    navigate('/pages/community-court');
  };

  return (
    <Page className="bg-[#050910] text-white min-h-screen flex flex-col">
      <Box className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold">Create Tournament</Text>
        <Text className="text-sm text-green-400">Organize your competition</Text>
      </Box>

      <Box className="flex-1 px-4">
        <Box className="mb-4">
          <Text className="mb-2">Tournament Name</Text>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter tournament name"
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Sport</Text>
          <Select
            options={sports}
            value={form.sport}
            onChange={(value) => setForm({ ...form, sport: value })}
            placeholder="Select sport"
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Format</Text>
          <Select
            options={formats}
            value={form.format}
            onChange={(value) => setForm({ ...form, format: value })}
            placeholder="Select format"
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Max Teams</Text>
          <Input
            type="number"
            value={form.maxTeams}
            onChange={(e) => setForm({ ...form, maxTeams: e.target.value })}
            placeholder="e.g., 16"
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Start Date</Text>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Description</Text>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description"
            className="bg-black/40 text-white"
          />
        </Box>
      </Box>

      <Box className="px-4 pb-4">
        <Button
          className="w-full bg-blue-400 text-white rounded-full"
          onClick={handleSubmit}
          disabled={!form.name || !form.sport || !form.format || !form.maxTeams || !form.startDate}
        >
          Create Tournament
        </Button>
      </Box>
    </Page>
  );
};

export default CreateTournamentPage;