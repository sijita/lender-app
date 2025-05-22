import { create } from 'zustand';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

interface SidebarState {
  isWeb: boolean;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isWeb,
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
