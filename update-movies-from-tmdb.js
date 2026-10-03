/**
 * Script: update-movies-from-tmdb.js
 * Fetch 40 phim đang chiếu + sắp chiếu mới nhất từ TMDB API
 * và UPDATE bảng movie trong MySQL Docker container
 * 
 * Chạy: node update-movies-from-tmdb.js
 */

const https = require("https");
const { execSync } = require("child_process");

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzgwMzgyZDEyOTk3ZDQ3NWEwNjg2MjU1MDNiMjg4MSIsIm5iZiI6MTcyOTU0MDcyNS45NTQ5OTMsInN1YiI6IjY3MTJhNDJlMjVjNzBiOGIxZDY3ZDY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zNPld_SAJs7Sp0B2aWHUMXqXpm70Wexc0UMcdV17KFI";

const MYSQL_CONTAINER = "backend_spring-mysql_db-1";
const MYSQL_DB = "hb_cinema_db";
const MYSQL_USER = "root";
const MYSQL_PASS = "root";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    };
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function runSQL(sql) {
  const escaped = sql.replace(/"/g, '\\"');
  try {
    const result = execSync(
      `docker exec ${MYSQL_CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${MYSQL_DB} -e "${escaped}" 2>/dev/null`,
      { encoding: "utf8" }
    );
    return result;
  } catch (e) {
    console.error("SQL Error:", e.message.substring(0, 200));
    return null;
  }
}

function escapeStr(str) {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .replace(/\r/g, "");
}

async function fetchMovies() {
  const movies = [];

  // Lấy phim đang chiếu (Now Playing)
  console.log("📡 Fetching now playing movies...");
  for (let page = 1; page <= 2; page++) {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&region=US`
    );
    if (data.results) movies.push(...data.results);
  }

  // Lấy phim sắp chiếu (Upcoming)
  console.log("📡 Fetching upcoming movies...");
  for (let page = 1; page <= 2; page++) {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}&region=US`
    );
    if (data.results) movies.push(...data.results);
  }

  // Lấy phim phổ biến
  console.log("📡 Fetching popular movies...");
  const popular = await fetchJson(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`
  );
  if (popular.results) movies.push(...popular.results);

  // Deduplicate theo id
  const unique = [...new Map(movies.map((m) => [m.id, m])).values()];

  // Lọc chỉ lấy phim có poster
  return unique.filter((m) => m.poster_path && m.title).slice(0, 40);
}

async function getMovieDetails(tmdbId) {
  try {
    const detail = await fetchJson(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US&append_to_response=videos`
    );

    // Tìm trailer YouTube
    let trailerId = String(tmdbId);
    if (detail.videos && detail.videos.results) {
      const trailer = detail.videos.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) trailerId = trailer.key;
    }

    return {
      duration: detail.runtime ? String(detail.runtime) : "120",
      language: detail.original_language || "en",
      trailer: trailerId,
    };
  } catch (e) {
    return { duration: "120", language: "en", trailer: String(tmdbId) };
  }
}

async function main() {
  console.log("🎬 HB Cinema — TMDB Movie Updater");
  console.log("=====================================\n");

  // Xóa phim cũ (giữ lại schedule references)
  console.log("🗑️  Clearing old movie data...");
  runSQL("SET FOREIGN_KEY_CHECKS=0; DELETE FROM movie; SET FOREIGN_KEY_CHECKS=1;");

  const movies = await fetchMovies();
  console.log(`\n✅ Found ${movies.length} movies from TMDB`);
  console.log("📝 Inserting into database...\n");

  let insertedCount = 0;
  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    const details = await getMovieDetails(m.id);

    const id = i + 1;
    const title = escapeStr(m.title);
    const image = `${IMAGE_BASE}${m.poster_path}`;
    const overview = escapeStr(
      (m.overview || "").substring(0, 1400)
    );
    const rating = m.vote_average || 0;
    const releaseDate = m.release_date
      ? `${m.release_date} 00:00:00.000000`
      : "2025-01-01 00:00:00.000000";

    const sql = `INSERT INTO movie (id, duration, image, language, over_view, rating, release_date, title, trailer) VALUES (${id}, '${details.duration}', '${image}', '${details.language}', '${overview}', ${rating}, '${releaseDate}', '${title}', '${details.trailer}');`;

    runSQL(sql);
    insertedCount++;
    process.stdout.write(`  [${i + 1}/${movies.length}] ${m.title}\n`);

    // Delay nhỏ tránh rate limit TMDB
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n🎉 Done! Inserted ${insertedCount} movies.`);

  // Verify
  const count = runSQL("SELECT COUNT(*) as total FROM movie;");
  console.log("📊 DB verification:", count?.trim() || "check manually");
  
  console.log("\n📋 Sample movies in DB:");
  const sample = runSQL("SELECT id, title, LEFT(image, 60) as image FROM movie LIMIT 5;");
  console.log(sample);
}

main().catch(console.error);
