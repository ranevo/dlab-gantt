import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'dlab_gantt',
  },
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  attachmentStorage: process.env.ATTACHMENT_STORAGE || 'C:/dlab-gantt/attachments',
  defaultHighlightColor: process.env.DEFAULT_HIGHLIGHT_COLOR || '#3182ce',
  defaultMemoFontSize: process.env.DEFAULT_MEMO_FONT_SIZE
    ? Number(process.env.DEFAULT_MEMO_FONT_SIZE)
    : 14,
};
