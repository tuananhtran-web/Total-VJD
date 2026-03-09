import { supabase } from './supabase';

export interface SystemSettings {
  homeBanners: string[];
  maintenanceMode: boolean;
  contactInfo: {
    hotline: string;
    email: string;
    address: string;
  };
}

const DEFAULT_SETTINGS: SystemSettings = {
  homeBanners: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ],
  maintenanceMode: false,
  contactInfo: {
    hotline: '1900 1234',
    email: 'support@vjd.vn',
    address: 'Ho Chi Minh City'
  }
};

const TABLE_NAME = 'system_settings';
const SETTINGS_KEY = 'global_config';

export const SystemSettingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('value')
      .eq('key', SETTINGS_KEY)
      .single();

    if (error || !data) {
      // If not found, try to create default
      if (error && error.code === 'PGRST116') { // Row not found
         await SystemSettingsService.saveSettings(DEFAULT_SETTINGS);
         return DEFAULT_SETTINGS;
      }
      console.error('Error fetching settings:', error);
      return DEFAULT_SETTINGS;
    }

    return { ...DEFAULT_SETTINGS, ...data.value };
  },

  saveSettings: async (settings: SystemSettings): Promise<boolean> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ 
        key: SETTINGS_KEY, 
        value: settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }
    return true;
  }
};
