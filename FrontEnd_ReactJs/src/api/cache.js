/**
 * Simple in-memory cache with TTL (time-to-live)
 * Tránh gọi API lặp lại không cần thiết khi dữ liệu chưa thay đổi.
 */

const cache = new Map();

const DEFAULT_TTL = 60 * 1000; // 60 giây

/**
 * Lấy dữ liệu từ cache hoặc gọi API nếu chưa có / đã hết hạn.
 * @param {string} key - Cache key (thường là URL API)
 * @param {Function} fetchFn - Hàm async trả về dữ liệu
 * @param {number} ttl - Thời gian sống của cache (ms), mặc định 60 giây
 */
export async function withCache(key, fetchFn, ttl = DEFAULT_TTL) {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, expiresAt: Date.now() + ttl });
  return data;
}

/**
 * Xóa cache của một key cụ thể (dùng sau khi thêm/sửa/xóa dữ liệu)
 * @param {string} key
 */
export function invalidateCache(key) {
  cache.delete(key);
}

/**
 * Xóa toàn bộ cache
 */
export function clearAllCache() {
  cache.clear();
}
