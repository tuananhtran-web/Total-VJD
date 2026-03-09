import React, { useState } from "react";
import { Page, Header, Button, Text, Box } from "zmp-ui";
import { supabase } from "../services/supabase";

const TestDBPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const test1 = async () => {
    setLoading(true);
    addLog("--- Running Test 1: Select * limit 1 ---");
    try {
      const { data, error } = await supabase.from('VJD').select('*').limit(1);
      if (error) {
        addLog(`❌ FAILED: ${error.message} (Code: ${error.code})`);
        console.error(error);
      } else {
        addLog(`✅ SUCCESS: Got ${data?.length} record(s)`);
        addLog(`Keys: ${data && data[0] ? Object.keys(data[0]).join(', ') : 'No data'}`);
      }
    } catch (e: any) {
      addLog(`❌ EXCEPTION: ${e.message}`);
    }
    setLoading(false);
  };

  const test2 = async () => {
    setLoading(true);
    addLog("--- Running Test 2: Select phone_number ---");
    try {
      // Mock a phone number to search (doesn't matter if it exists, just testing the query structure)
      const phone = '0901234567'; 
      const { data, error } = await supabase
        .from('VJD')
        .select('phone_number')
        .eq('phone_number', phone)
        .limit(1);

      if (error) {
        addLog(`❌ FAILED: ${error.message}`);
      } else {
        addLog(`✅ SUCCESS: Query executed without error.`);
      }
    } catch (e: any) {
      addLog(`❌ EXCEPTION: ${e.message}`);
    }
    setLoading(false);
  };

  const test3 = async () => {
    setLoading(true);
    addLog("--- Running Test 3: Select id where phone & is_locked ---");
    try {
      const phone = '0901234567';
      const { data, error } = await supabase
        .from('VJD')
        .select('id')
        .eq('phone_number', phone)
        .eq('is_locked', false) // This will fail if schema cache is stale
        .limit(1);

      if (error) {
        addLog(`❌ FAILED: ${error.message} (Code: ${error.code})`);
        if (error.code === 'PGRST204') {
          addLog("👉 LỖI NÀY LÀ DO SCHEMA CACHE CHƯA RELOAD!");
        }
      } else {
        addLog(`✅ SUCCESS: Query executed without error.`);
        addLog("👉 Schema cache đã nhận diện được cột is_locked!");
      }
    } catch (e: any) {
      addLog(`❌ EXCEPTION: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <Page className="bg-white">
      <Header title="Test Database Connection" showBackIcon />
      <Box className="p-4">
        <Text.Title className="mb-4 text-center text-red-600">
          Công cụ kiểm tra lỗi Schema Cache
        </Text.Title>
        
        <div className="flex flex-col gap-3 mb-6">
          <Button onClick={test1} loading={loading} className="bg-blue-600">Test 1: Select All (Check basic)</Button>
          <Button onClick={test2} loading={loading} className="bg-green-600">Test 2: Select phone_number</Button>
          <Button onClick={test3} loading={loading} className="bg-purple-600">Test 3: Check is_locked (Quan trọng)</Button>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg min-h-[200px] overflow-auto border border-gray-300">
          <Text.Title size="small" className="mb-2">Kết quả Log:</Text.Title>
          {logs.length === 0 ? (
            <Text className="text-gray-400 italic">Chưa có log nào...</Text>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-xs font-mono mb-1 border-b border-gray-200 pb-1 last:border-0">
                {log}
              </div>
            ))
          )}
        </div>
      </Box>
    </Page>
  );
};

export default TestDBPage;
