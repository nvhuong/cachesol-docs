import type { ThemeConfig } from 'antd';
import { tokens } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.colors.primary,
    colorSuccess: tokens.colors.success,
    colorWarning: tokens.colors.warning,
    colorError: tokens.colors.error,
    colorInfo: tokens.colors.info,
    
    colorText: tokens.colors.text,
    colorTextSecondary: tokens.colors.textSecondary,
    
    colorBorder: tokens.colors.border,
    
    borderRadius: tokens.radius.md,
    fontSize: tokens.fontSize.sm,
    
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  components: {
    Button: {
      borderRadius: tokens.radius.md,
      controlHeight: 36,
    },
    
    Card: {
      borderRadiusLG: tokens.radius.lg,
    },
    
    Input: {
      borderRadius: tokens.radius.md,
      controlHeight: 36,
    },
    
    Select: {
      borderRadius: tokens.radius.md,
      controlHeight: 36,
    },
    
    Table: {
      borderRadius: tokens.radius.md,
      headerBg: tokens.colors.bgSecondary,
    },
    
    Modal: {
      borderRadiusLG: tokens.radius.lg,
    },
  },
};
