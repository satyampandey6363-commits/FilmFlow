import crypto from 'crypto';
import { cookies } from 'next/headers';

const pw = () => process.env.ADMIN_PASSWORD || 'admin123';
export const token = () => crypto.createHash('sha256').update(pw() + ':filmflow').digest('hex');
export const isAdmin = () => cookies().get('ff_admin')?.value === token();
export const checkPassword = (p) => p === pw();
