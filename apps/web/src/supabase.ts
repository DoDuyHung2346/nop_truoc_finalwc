import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

export const isSupabaseConfigured = Boolean(url && key && !url.includes('your-project-ref'));
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-anon-key');

type RpcArgs = Record<string, unknown>;

async function rpc(name: string, args: RpcArgs = {}) {
  if (!isSupabaseConfigured) {
    throw { code: 'SUPABASE_NOT_CONFIGURED', message: 'Ứng dụng chưa được cấu hình Supabase. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.' };
  }
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw { code: error.code || 'DATABASE_ERROR', message: error.message || 'Không thể kết nối cơ sở dữ liệu.' };
  if (data?.error) throw data.error;
  return data;
}

export async function dataApi(urlString: string, options?: RequestInit) {
  const url = new URL(urlString, window.location.origin);
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.parse(String(options.body)) : {};
  const q = (key: string) => url.searchParams.get(key) || '';

  if (method === 'GET' && url.pathname === '/api/health') return { ok: true };
  if (method === 'GET' && url.pathname === '/api/devices') return rpc('get_devices', { p_q: q('q'), p_status: q('status'), p_type: q('type') });
  if (method === 'GET' && url.pathname === '/api/requests') return rpc('get_requests', { p_q: q('q'), p_status: q('status'), p_device_code: q('deviceCode') });
  if (method === 'GET' && url.pathname === '/api/stats') return rpc('get_stats');
  if (method === 'GET' && url.pathname === '/api/availability') return rpc('check_availability', { p_device_code: q('deviceCode'), p_borrow_date: q('borrowDate'), p_return_date: q('returnDate'), p_exclude_code: q('excludeCode') || null });
  if (method === 'GET' && /^\/api\/requests\/[^/]+$/.test(url.pathname)) return rpc('get_request_detail', { p_code: url.pathname.split('/').pop() });
  if (method === 'POST' && url.pathname === '/api/requests') return rpc('create_borrow_request', { p_payload: body, p_policy: import.meta.env.VITE_SUBMIT_CONFLICT_POLICY || 'warn' });
  if (method === 'PATCH' && /^\/api\/requests\/[^/]+\/status$/.test(url.pathname)) return rpc('change_request_status', { p_code: url.pathname.split('/')[3], p_status: body.status, p_note: body.note || null });
  if (method === 'POST' && url.pathname === '/api/admin/seed') return rpc('reset_seed_data');
  if (method === 'PATCH' && /^\/api\/devices\/[^/]+$/.test(url.pathname)) return rpc('update_device', { p_code: url.pathname.split('/').pop(), p_payload: body });
  throw { code: 'NOT_FOUND', message: 'Không tìm thấy thao tác dữ liệu.' };
}
