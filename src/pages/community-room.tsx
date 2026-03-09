import React from "react";
import { Page, Box, Text, Button, Icon } from "zmp-ui";

const CommunityRoomPage: React.FC = () => {
  return (
    <Page className="bg-[#032013] text-white min-h-screen pb-24">
      {/* Top bar */}
      <Box className="px-4 pt-3 pb-2 flex items-center justify-between">
        <Box className="flex items-center gap-3">
          <Button
            size="small"
            variant="secondary"
            className="bg-transparent border-0 p-0 min-w-0"
          >
            <Icon icon="zi-chevron-left" className="text-xl text-white" />
          </Button>
          <Text className="font-semibold text-base">Pickleball Court 1</Text>
        </Box>
        <Button
          size="small"
          variant="secondary"
          className="bg-transparent border-0 p-0 min-w-0"
        >
          <Icon icon="zi-share" className="text-xl text-white" />
        </Button>
      </Box>

      {/* Main content */}
      <Box className="px-4 space-y-4">
        {/* Court card */}
        <Box className="bg-[#05301D] rounded-3xl p-4 flex gap-3 items-center">
          <Box className="w-16 h-16 rounded-2xl bg-[url('https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center" />
          <Box className="flex-1">
            <Box className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded-full bg-[#0B7A4B] text-[10px] font-semibold">
                Live Now
              </span>
              <Text className="text-[11px] text-[#7FFFD4]">4/4 Slots Filled</Text>
            </Box>
            <Text className="font-semibold text-sm mb-0.5">
              Morning Mixed Doubles
            </Text>
            <Text className="text-[11px] text-[#9BE6C7]">
              <Icon icon="zi-time" className="mr-1" />
              12:00 PM – 02:00 PM
            </Text>
          </Box>
        </Box>

        {/* Tabs */}
        <Box className="bg-[#05301D] rounded-full p-1 flex">
          <Button
            fullWidth
            size="small"
            className="bg-[#00C853] text-white rounded-full h-9 text-xs font-semibold"
          >
            Match View
          </Button>
          <Button
            fullWidth
            size="small"
            variant="secondary"
            className="bg-transparent text-white/70 rounded-full h-9 text-xs font-semibold"
          >
            Member List
          </Button>
        </Box>

        {/* Current Match */}
        <Box className="mt-2">
          <Box className="flex items-center justify-between mb-3">
            <Text className="font-semibold text-sm">Current Match</Text>
            <Text className="text-[11px] text-[#7FFFD4]">Pro Skill Level</Text>
          </Box>

          <Box className="grid grid-cols-2 gap-3 mb-4">
            {/* Player 1 */}
            <Box className="bg-[#05301D] rounded-3xl p-3 flex flex-col items-center gap-2">
              <Box className="w-14 h-14 rounded-full bg-[url('https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center border-2 border-[#00C853]" />
              <Text className="text-sm font-semibold">Alex Rivera</Text>
              <Text className="text-[11px] text-[#9BE6C7]">Rank: #14</Text>
            </Box>

            {/* Player 2 */}
            <Box className="bg-[#05301D] rounded-3xl p-3 flex flex-col items-center gap-2">
              <Box className="w-14 h-14 rounded-full bg-[url('https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center border-2 border-[#00C853]" />
              <Text className="text-sm font-semibold">Sarah Chen</Text>
              <Text className="text-[11px] text-[#9BE6C7]">Rank: #08</Text>
            </Box>

            {/* Empty slot 1 */}
            <Box className="border-2 border-dashed border-[#1B5E3A] rounded-3xl p-3 flex flex-col items-center gap-2">
              <Box className="w-10 h-10 rounded-full bg-[#0B7A4B] flex items-center justify-center">
                <Icon icon="zi-user-plus" className="text-white" />
              </Box>
              <Button
                size="small"
                className="mt-1 bg-[#00C853] text-white rounded-full px-4 h-8 text-xs font-semibold"
              >
                Join Match
              </Button>
            </Box>

            {/* Empty slot 2 */}
            <Box className="border-2 border-dashed border-[#1B5E3A] rounded-3xl p-3 flex flex-col items-center gap-2">
              <Box className="w-10 h-10 rounded-full bg-[#0B7A4B] flex items-center justify-center">
                <Icon icon="zi-user-plus" className="text-white" />
              </Box>
              <Button
                size="small"
                className="mt-1 bg-[#00C853] text-white rounded-full px-4 h-8 text-xs font-semibold"
              >
                Join Match
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Waiting Line */}
        <Box className="mt-2">
          <Box className="flex items-center justify-between mb-2">
            <Text className="font-semibold text-sm">Waiting Line (3)</Text>
            <Text className="text-[11px] text-[#7FFFD4]">See all</Text>
          </Box>

          <Box className="space-y-2">
            <Box className="bg-[#05301D] rounded-2xl p-3 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="w-10 h-10 rounded-full bg-[url('https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center" />
                <Box>
                  <Text className="text-sm font-semibold">Marcus T.</Text>
                  <Text className="text-[11px] text-[#9BE6C7]">
                    Ready to play · 5m ago
                  </Text>
                </Box>
              </Box>
              <Icon icon="zi-more-h" className="text-gray-400" />
            </Box>

            <Box className="bg-[#05301D] rounded-2xl p-3 flex items-center justify-between">
              <Box className="flex items-center gap-3">
                <Box className="w-10 h-10 rounded-full bg-[url('https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center" />
                <Box>
                  <Text className="text-sm font-semibold">Elena R.</Text>
                  <Text className="text-[11px] text-[#9BE6C7]">
                    Warming up · 12m ago
                  </Text>
                </Box>
              </Box>
              <Icon icon="zi-more-h" className="text-gray-400" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default CommunityRoomPage;

