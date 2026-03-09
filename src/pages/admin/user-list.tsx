import React, { useEffect, useState } from "react";
import { Page, Header, Box, List, Text, Avatar, Icon, Input, useNavigate } from "zmp-ui";
import { UserService, User } from "../../services/user-service";

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(search.toLowerCase()) || 
    user.phoneNumber.includes(search)
  );

  return (
    <Page className="bg-gray-50 h-full">
      <Header title="Quản lý thành viên" showBackIcon={false} />
      
      <Box className="p-4 bg-white mb-2">
        <Input.Search
          placeholder="Tìm kiếm thành viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Box className="pb-20">
        {loading ? (
          <div className="flex justify-center p-4">Đang tải...</div>
        ) : (
          <List>
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                onClick={() => navigate(`/pages/admin/user-detail`, { state: { userId: user.id } })}
                className="bg-white p-4 mb-1 flex items-center justify-between active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar}>{user.displayName.charAt(0)}</Avatar>
                  <div>
                    <Text className="font-bold flex items-center gap-2">
                      {user.displayName}
                      {user.isLocked && <Icon icon="zi-lock-solid" size={14} className="text-red-500"/>}
                    </Text>
                    <Text size="xSmall" className="text-gray-500">{user.phoneNumber}</Text>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                     user.package.status === 'active' ? 'bg-green-100 text-green-700' :
                     user.package.status === 'expired' ? 'bg-red-100 text-red-700' :
                     'bg-yellow-100 text-yellow-700'
                   }`}>
                     {user.package.status === 'active' ? 'Hoạt động' :
                      user.package.status === 'expired' ? 'Hết hạn' : 'Chờ duyệt'}
                   </div>
                   <Text size="xxSmall" className="text-gray-400 mt-1">
                     {user.package.name}
                   </Text>
                </div>
              </div>
            ))}
          </List>
        )}
      </Box>
    </Page>
  );
};

export default UserListPage;
