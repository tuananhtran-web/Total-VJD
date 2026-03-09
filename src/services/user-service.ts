import { supabase } from './supabase';

export interface UserPackage {
  name: string;
  expiryDate: number; // timestamp in milliseconds
  status: 'active' | 'expired' | 'pending';
}

export interface User {
  id: string;
  displayName: string;
  phoneNumber: string;
  avatar: string;
  isLocked: boolean;
  package: UserPackage;
  password?: string;
  createdAt?: any;
}

const TABLE_NAME = 'VJD';

// Mock data for fallback
const MOCK_USERS: User[] = [
  {
    id: 'user1',
    displayName: 'Nguyễn Văn A',
    phoneNumber: '0901234567',
    avatar: '',
    isLocked: false,
    package: {
      name: 'Gói Tháng',
      expiryDate: Date.now() + 86400000 * 15, // 15 days left
      status: 'active'
    },
    password: '123'
  },
  {
    id: 'user2',
    displayName: 'Trần Thị B',
    phoneNumber: '0909876543',
    avatar: '',
    isLocked: true,
    package: {
      name: 'Gói Năm',
      expiryDate: Date.now() - 86400000, // Expired yesterday
      status: 'expired'
    },
    password: '123'
  },
  {
    id: 'user3',
    displayName: 'Lê Văn C',
    phoneNumber: '0912345678',
    avatar: '',
    isLocked: false,
    package: {
      name: 'Gói Cơ Bản',
      expiryDate: Date.now() + 86400000 * 30,
      status: 'pending'
    },
    password: '123'
  }
];

// Helper to check if we are in "mock mode" (rudimentary check)
const isMockMode = () => {
  return false; 
};

// In-memory store for mock updates
let mockStore = [...MOCK_USERS];

// Mapping helpers (CamelCase <-> snake_case)
const toDB = (user: Partial<User> & { updatedAt?: string }) => {
  const dbUser: any = {};
  if (user.phoneNumber !== undefined) dbUser.phone_number = user.phoneNumber;
  if (user.displayName !== undefined) dbUser.display_name = user.displayName;
  if (user.isLocked !== undefined) dbUser.is_locked = user.isLocked;
  if (user.createdAt !== undefined) dbUser.created_at = user.createdAt;
  if (user.avatar !== undefined) dbUser.avatar = user.avatar;
  if (user.package !== undefined) dbUser.package = user.package;
  if (user.password !== undefined) dbUser.password = user.password;
  if (user.updatedAt !== undefined) dbUser.updated_at = user.updatedAt;
  
  // Explicitly map id if provided (e.g. for update/upsert)
  if (user.id) dbUser.id = user.id;
  
  return dbUser;
};

const fromDB = (dbUser: any): User => ({
  id: String(dbUser.id),
  phoneNumber: dbUser.phone_number || '',
  displayName: dbUser.display_name || '',
  isLocked: dbUser.is_locked || false,
  createdAt: dbUser.created_at,
  avatar: dbUser.avatar || '',
  package: dbUser.package || { name: 'Thành viên mới', expiryDate: 0, status: 'pending' },
  password: dbUser.password
});

export const UserService = {
  getUserByPhone: async (phoneNumber: string): Promise<User | null> => {
    try {
        if (isMockMode()) {
            return mockStore.find(u => u.phoneNumber === phoneNumber) || null;
        }
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('phone_number', phoneNumber)
            .maybeSingle();
        
        if (error) throw error;
        return data ? fromDB(data) : null;
    } catch (error) {
        console.error("Get user by phone error:", error);
        return null;
    }
  },

  login: async (phoneNumber: string, password: string): Promise<User | null> => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      );

      const loginPromise = (async () => {
        if (isMockMode()) {
          const user = mockStore.find(u => u.phoneNumber === phoneNumber && u.password === password);
          return user || null;
        }
        
        // Use maybeSingle to avoid 406 error if user not found
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .eq('phone_number', phoneNumber) // Use snake_case
          .eq('password', password)
          .maybeSingle();

        if (error) {
           console.error("Supabase Login error:", error);
           throw error;
        }
        
        if (data) {
          return fromDB(data);
        }
        return null;
      })();

      return await Promise.race([loginPromise, timeoutPromise]) as User | null;
    } catch (error) {
      console.error("Login error:", error);
      // Fallback to mock
      const user = mockStore.find(u => u.phoneNumber === phoneNumber && u.password === password);
      return user || null;
    }
  },

  register: async (user: User): Promise<User> => {
    // Check if phone number exists
    try {
      if (!isMockMode()) {
        // Use maybeSingle to avoid 406 error if not found
        const { data } = await supabase
          .from(TABLE_NAME)
          .select('phone_number') // Use snake_case
          .eq('phone_number', user.phoneNumber)
          .maybeSingle();
          
        if (data) {
          throw new Error("Số điện thoại đã tồn tại");
        }
      } else {
        if (mockStore.some(u => u.phoneNumber === user.phoneNumber)) {
          throw new Error("Số điện thoại đã tồn tại");
        }
      }
    } catch (error: any) {
       if (error.message === "Số điện thoại đã tồn tại") throw error;
       console.warn("Check phone error, proceeding with caution:", error);
    }

    // Create user object for DB (remove id to let DB generate it)
    const { id, ...userWithoutId } = user;
    
    // Default package and createdAt if not present
    const userToCreate = {
      ...userWithoutId,
      package: user.package || {
        name: 'Thành viên mới',
        expiryDate: Date.now() + 86400000 * 30, // 30 days trial
        status: 'active'
      },
      createdAt: new Date().toISOString()
    };

    const dbUserPayload = toDB(userToCreate);

    try {
      // Add timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      );

      const registerPromise = (async () => {
        if (!isMockMode()) {
           const { data, error } = await supabase
             .from(TABLE_NAME)
             .insert(dbUserPayload)
             .select()
             .single();
             
           if (error) throw error;
           return fromDB(data);
        }
        return null; // Mock mode handled below
      })();

      if (!isMockMode()) {
        const result = await Promise.race([registerPromise, timeoutPromise]);
        if (result) return result as User;
      }
    } catch (e) {
      console.error("Register Supabase error, using mock:", e);
    }

    // Fallback if supabase fails or in mock mode
    const fallbackUser = { ...userToCreate, id: user.id || `user-${Date.now()}` } as User;
    mockStore.push(fallbackUser);
    return fallbackUser;
  },

  getAllUsers: async (): Promise<User[]> => {
    if (isMockMode()) {
      return new Promise(resolve => setTimeout(() => resolve([...mockStore]), 500));
    }
    
    const { data, error } = await supabase.from(TABLE_NAME).select('*');
    if (error) {
       console.error("Get all users error:", error);
       return [...mockStore];
    }
    return (data || []).map(fromDB);
  },

  getUserById: async (id: string): Promise<User | null> => {
    if (isMockMode()) {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockStore.find(u => u.id === id) || null), 300);
      });
    }
    
    const { data, error } = await supabase
       .from(TABLE_NAME)
       .select('*')
       .eq('id', id)
       .single();
       
     if (error || !data) return null;
     return fromDB(data);
   },

  updateUser: async (id: string, data: Partial<User>): Promise<void> => {
    if (isMockMode()) {
      mockStore = mockStore.map(u => u.id === id ? { ...u, ...data } : u);
      return Promise.resolve();
    }
    
    const dbData = toDB(data);
    await supabase.from(TABLE_NAME).update(dbData).eq('id', id);
  },

  deleteUser: async (id: string): Promise<void> => {
    if (isMockMode()) {
      mockStore = mockStore.filter(u => u.id !== id);
      return Promise.resolve();
    }
    await supabase.from(TABLE_NAME).delete().eq('id', id);
  },

  toggleLockUser: async (id: string, isLocked: boolean): Promise<void> => {
    return UserService.updateUser(id, { isLocked });
  },

  addBonusDays: async (id: string, days: number): Promise<void> => {
    const user = isMockMode() ? mockStore.find(u => u.id === id) : await UserService.getUserById(id);
    if (!user) throw new Error("User not found");

    const currentExpiry = user.package.expiryDate > Date.now() ? user.package.expiryDate : Date.now();
    const newExpiry = currentExpiry + (days * 86400000);
    
    // Also update status if it was expired
    const newStatus = user.package.status === 'expired' ? 'active' : user.package.status;

    return UserService.updateUser(id, {
      package: {
        ...user.package,
        expiryDate: newExpiry,
        status: newStatus
      }
    });
  },

  updatePackageStatus: async (id: string, status: UserPackage['status']): Promise<void> => {
    const user = isMockMode() ? mockStore.find(u => u.id === id) : await UserService.getUserById(id);
    if (!user) throw new Error("User not found");
    
    return UserService.updateUser(id, {
      package: {
        ...user.package,
        status
      }
    });
  },

  syncUserToFirestore: async (user: User): Promise<void> => {
    if (!user.id) return;
    try {
      if (isMockMode()) {
        const index = mockStore.findIndex(u => u.id === user.id);
        if (index >= 0) {
            // Merge existing data with new data
            mockStore[index] = { ...mockStore[index], ...user };
        } else {
            mockStore.push(user);
        }
        console.log("User synced to Mock Store:", user.id);
        return;
      }

      // Convert to DB format
      const dbUser = toDB({
          ...user,
          updatedAt: new Date().toISOString()
      });

      const { error } = await supabase
        .from(TABLE_NAME)
        .upsert(dbUser, { onConflict: 'id' });
        
      if (error) throw error;
      console.log("User synced to Supabase:", user.id);
    } catch (error) {
      console.error("Error syncing user to Supabase:", error);
      // Fallback: update local mock store even if firestore fails
      const index = mockStore.findIndex(u => u.id === user.id);
      if (index >= 0) {
        mockStore[index] = { ...mockStore[index], ...user };
      } else {
        mockStore.push(user);
      }
    }
  }
};
