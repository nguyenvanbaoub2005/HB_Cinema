#!/usr/bin/env python3
import json
import subprocess
import sys

CONTAINER = "backend_spring-mysql_db-1"
DB = "hb_cinema_db"
IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

def escape(s):
    if not s: return ""
    s = str(s)[:1400]
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", "")

def main():
    print("🎬 HB Cinema — TMDB Movie Updater (Local JSON mode - Safe UPDATE)")
    
    with open("movies.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    movies = data.get("results", [])
    
    unique = []
    seen = set()
    for m in movies:
        if m.get("id") not in seen and m.get("poster_path") and m.get("title"):
            seen.add(m["id"])
            unique.append(m)
            
    print(f"✅ Found {len(unique)} movies to update")
    
    sql_parts = []
    
    # Chỉ update 30 phim hiện có trong database để giữ nguyên schedule, vé
    max_id = min(len(unique), 30)
    
    for i in range(max_id):
        m = unique[i]
        mid = i + 1
        title = escape(m.get("title", ""))
        image = f"{IMAGE_BASE}{m['poster_path']}"
        overview = escape(m.get("overview", ""))
        rating = float(m.get("vote_average", 0))
        release = m.get("release_date") or "2025-01-01"
        release += " 00:00:00.000000"
        lang = escape(m.get("original_language", "en"))
        trailer = str(m["id"])
        
        # SỬ DỤNG UPDATE thay vì INSERT
        sql = f"UPDATE movie SET title='{title}', image='{image}', over_view='{overview}', rating={rating:.3f}, release_date='{release}', language='{lang}', trailer='{trailer}' WHERE id={mid};"
        sql_parts.append(sql)
        
    full_sql = "\n".join(sql_parts)
    
    print("📝 Updating MySQL data...")
    cmd = ["docker", "exec", "-i", CONTAINER, "mysql", "-uroot", "-proot", DB]
    result = subprocess.run(cmd, input=full_sql.encode("utf-8"), capture_output=True)
    
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr.decode()}")
    else:
        print("🎉 Done! Database restored and movies safely updated. Please refresh the website.")

if __name__ == "__main__":
    main()
