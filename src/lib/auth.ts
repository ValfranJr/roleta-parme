import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'admin_session';

export function setAdminSession(username: string) {
  cookies().set(SESSION_COOKIE_NAME, username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export function clearAdminSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export function getAdminSession(): string | undefined {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

export function requireAdminAuth() {
  if (!getAdminSession()) {
    redirect('/admin/login');
  }
}