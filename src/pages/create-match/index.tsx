import React, { useState } from "react";
import { Page, Box, Text, Button, Icon, Input, Select, useNavigate } from "zmp-ui";

const sports = [
  { value: "pickleball", label: "Pickleball" },
  { value: "badminton", label: "Badminton" },
  { value: "tennis", label: "Tennis" },
];

const courts = [
  { value: "court1", label: "Sân Pickleball Apolo" },
  { value: "court2", label: "Sân Cầu Lông VJD" },
  { value: "court3", label: "Sân Tennis Central" },
];

const opponents = [
  { value: "op1", label: "Team Bravo (Rank 15)" },
  { value: "op2", label: "Team Charlie (Rank 8)" },
  { value: "op3", label: "Team Delta (Rank 20)" },
  { value: "op4", label: "Random Opponent" },
];

const CreateMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sport: "",
    court: "",
    time: "",
    opponent: "",
  });

  const handleSubmit = () => {
    // Simulate creating match
    alert("Match created! Navigating to court...");
    navigate('/pages/court/index');
  };

  return (
    <Page className="bg-[#050910] text-white min-h-screen flex flex-col">
      <Box className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold">Create Match</Text>
        <Text className="text-sm text-green-400">Set up your challenge</Text>
      </Box>

      <Box className="flex-1 px-4">
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
          <Text className="mb-2">Court</Text>
          <Select
            options={courts}
            value={form.court}
            onChange={(value) => setForm({ ...form, court: value })}
            placeholder="Select court"
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Time</Text>
          <Input
            type="datetime-local"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="bg-black/40 text-white"
          />
        </Box>

        <Box className="mb-4">
          <Text className="mb-2">Opponent</Text>
          <Select
            options={opponents}
            value={form.opponent}
            onChange={(value) => setForm({ ...form, opponent: value })}
            placeholder="Select opponent"
            className="bg-black/40 text-white"
          />
        </Box>
      </Box>

      <Box className="px-4 pb-4">
        <Button
          className="w-full bg-green-400 text-black rounded-full"
          onClick={handleSubmit}
          disabled={!form.sport || !form.court || !form.time || !form.opponent}
        >
          Create Match
        </Button>
      </Box>
    </Page>
  );
};

export default CreateMatchPage;