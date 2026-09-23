/**
 * Re-export AntD's Typography với cacheSol defaults.
 *
 * Use Case: hiển thị heading, paragraph, text với tone semantics.
 * Tránh tạo custom component — chỉ chuẩn hoá defaults.
 */
import { Typography } from 'antd';

export const { Title, Paragraph, Text, Link } = Typography;

export default Typography;
