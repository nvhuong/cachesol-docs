/**
 * Ant Design 5 theme configuration bridged to CacheSol Design Tokens.
 *
 * Why: antd v5 uses ConfigProvider + theme algorithm. We override tokens with
 * CacheSol values so every antd component picks up our visual language by
 * default.
 *
 * Usage:
 *   import { ConfigProvider } from 'antd';
 *   import { cachesolTheme } from '@cachesol/design-system';
 *
 *   <ConfigProvider theme={cachesolTheme}>
 *     <App />
 *   </ConfigProvider>
 */
import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';
import { brand, neutral, success, warning, error } from './tokens/colors';
import { fontFamily, fontSize } from './tokens/typography';

export const cachesolTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary:   brand[600],
    colorInfo:      brand[600],
    colorSuccess:   success[600],
    colorWarning:   warning[600],
    colorError:     error[600],

    colorTextBase:         neutral[900],
    colorBgBase:           neutral[0],
    colorBgLayout:         neutral[50],
    colorBorder:           neutral[200],
    colorBorderSecondary:  neutral[100],

    borderRadius:        8,    // radius.lg
    borderRadiusLG:      8,
    borderRadiusSM:      4,    // radius.sm
    borderRadiusXS:      2,    // radius.xs

    fontFamily:      fontFamily.sans,
    fontSize:        fontSize['body-md'],     // 14
    fontSizeHeading1: fontSize['display-md'], // 30
    fontSizeHeading2: fontSize['heading-xl'], // 24
    fontSizeHeading3: fontSize['heading-lg'], // 20
    fontSizeHeading4: fontSize['heading-md'], // 18
    fontSizeHeading5: fontSize['heading-sm'], // 16

    controlHeight:      40,  // md
    controlHeightLG:    48,  // lg
    controlHeightSM:    32,  // sm
    controlPaddingHorizontal: 16,

    wireframe: false,
    motionDurationFast:   '0.1s',
    motionDurationMid:    '0.15s',
    motionDurationSlow:   '0.2s',
  },
  components: {
    Button: {
      controlHeight:      40,
      controlHeightLG:    48,
      controlHeightSM:    32,
      fontWeight: 600,
      borderRadius: 8,
      paddingInline: 16,
      paddingInlineLG: 20,
      paddingInlineSM: 12,
    },
    Input: {
      controlHeight:      40,
      controlHeightLG:    48,
      controlHeightSM:    32,
      borderRadius: 6,
      paddingInline: 12,
    },
    Select: {
      controlHeight:      40,
      controlHeightLG:    48,
      controlHeightSM:    32,
      borderRadius: 6,
    },
    DatePicker: {
      controlHeight:      40,
      controlHeightLG:    48,
      controlHeightSM:    32,
      borderRadius: 6,
    },
    Modal: {
      borderRadiusLG: 8,
      paddingContentHorizontalLG: 24,
    },
    Drawer: {
      borderRadiusLG: 8,
    },
    Card: {
      borderRadiusLG: 8,
      paddingLG: 24,
    },
    Tabs: {
      titleFontSize: 14,
      horizontalItemPadding: '12px 0',
      horizontalItemGutter: 32,
    },
    Table: {
      headerBg: neutral[50],
      headerColor: neutral[700],
      headerSplitColor: neutral[200],
      borderColor: neutral[200],
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
      rowHoverBg: neutral[50],
    },
    Tag: {
      borderRadiusSM: 4,
      defaultBg: neutral[100],
      defaultColor: neutral[700],
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: brand[50],
      itemSelectedColor: neutral[900],
      itemHoverBg: neutral[100],
      itemBorderRadius: 6,
      iconSize: 18,
    },
    Layout: {
      headerBg: neutral[0],
      headerHeight: 56,
      headerPadding: '0 24px',
      siderBg: neutral[0],
      bodyBg: neutral[50],
      triggerBg: neutral[100],
      triggerColor: neutral[700],
    },
    Breadcrumb: {
      itemColor: neutral[500],
      lastItemColor: neutral[900],
      separatorColor: neutral[300],
    },
    Form: {
      labelFontSize: 14,
      labelColor: neutral[700],
      verticalLabelPadding: '0 0 6px',
    },
    Pagination: {
      itemBg: neutral[0],
      itemActiveBg: brand[50],
      itemActiveColor: brand[600],
    },
    Alert: {
      borderRadiusLG: 8,
    },
    Notification: {
      borderRadiusLG: 8,
    },
    Message: {
      borderRadiusLG: 8,
      contentBg: neutral[0],
    },
  },
};

export default cachesolTheme;
