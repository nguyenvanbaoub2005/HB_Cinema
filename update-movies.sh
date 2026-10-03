#!/bin/bash
# Script: update-movies.sh
# Fetch phim mới từ TMDB và insert vào MySQL Docker

TMDB_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzgwMzgyZDEyOTk3ZDQ3NWEwNjg2MjU1MDNiMjg4MSIsIm5iZiI6MTcyOTU0MDcyNS45NTQ5OTMsInN1YiI6IjY3MTJhNDJlMjVjNzBiOGIxZDY3ZDY4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zNPld_SAJs7Sp0B2aWHUMXqXpm70Wexc0UMcdV17KFI"
CONTAINER="backend_spring-mysql_db-1"
DB="hb_cinema_db"
IMAGE_BASE="https://image.tmdb.org/t/p/w500"

echo "🎬 HB Cinema — TMDB Movie Updater"
echo "====================================="

# Fetch now playing page 1 và 2
echo "📡 Fetching movies from TMDB..."
MOVIES_JSON=$(curl -s \
  "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=US" \
  -H "Authorization: Bearer $TMDB_TOKEN")

MOVIES2_JSON=$(curl -s \
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1" \
  -H "Authorization: Bearer $TMDB_TOKEN")

MOVIES3_JSON=$(curl -s \
  "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1" \
  -H "Authorization: Bearer $TMDB_TOKEN")

# Generate SQL insert từ JSON dùng python3
SQL_FILE="/tmp/movies_insert.sql"

python3 << PYEOF
import json, sys, re

token = "$TMDB_TOKEN"
image_base = "$IMAGE_BASE"

movies1 = json.loads('''$MOVIES_JSON''').get("results", [])
movies2 = json.loads('''$MOVIES2_JSON''').get("results", [])
movies3 = json.loads('''$MOVIES3_JSON''').get("results", [])

all_movies = movies1 + movies2 + movies3

# Deduplicate
seen = set()
unique = []
for m in all_movies:
    if m["id"] not in seen and m.get("poster_path") and m.get("title"):
        seen.add(m["id"])
        unique.append(m)

unique = unique[:35]  # Max 35 phim

with open("$SQL_FILE", "w") as f:
    f.write("SET FOREIGN_KEY_CHECKS=0;\n")
    f.write("DELETE FROM schedule;\n")  
    f.write("DELETE FROM movie;\n")
    f.write("SET FOREIGN_KEY_CHECKS=1;\n\n")
    
    for i, m in enumerate(unique):
        mid = i + 1
        title = m.get("title", "").replace("'", "\\'").replace('"', '\\"')[:200]
        image = f"{image_base}{m['poster_path']}"
        overview = m.get("overview", "").replace("'", "\\'").replace('"', '\\"').replace("\n", " ")[:1400]
        rating = m.get("vote_average", 0)
        release = m.get("release_date", "2025-01-01")
        if release: release += " 00:00:00.000000"
        else: release = "2025-01-01 00:00:00.000000"
        lang = m.get("original_language", "en")
        trailer = str(m["id"])
        
        f.write(f"INSERT INTO movie (id, duration, image, language, over_view, rating, release_date, title, trailer) VALUES ({mid}, '120', '{image}', '{lang}', '{overview}', {rating}, '{release}', '{title}', '{trailer}');\n")

print(f"✅ Generated SQL for {len(unique)} movies")
PYEOF

# Import vào MySQL
echo "📝 Importing into MySQL..."
docker exec -i $CONTAINER mysql -uroot -proot $DB 2>/dev/null < $SQL_FILE

echo ""
echo "📊 Verification:"
docker exec $CONTAINER mysql -uroot -proot $DB -e "SELECT COUNT(*) as total_movies FROM movie; SELECT id, title FROM movie ORDER BY id LIMIT 10;" 2>/dev/null

echo ""
echo "🎉 Done!"
