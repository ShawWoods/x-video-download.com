# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
import re
import json
from typing import Optional, List
import sqlite3
from datetime import datetime, timedelta
import asyncio
from bs4 import BeautifulSoup

app = FastAPI(title="X Video Downloader API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
def init_db():
    conn = sqlite3.connect('downloads.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS downloads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_url TEXT NOT NULL,
            video_title TEXT,
            download_count INTEGER DEFAULT 1,
            last_downloaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class VideoURL(BaseModel):
    url: HttpUrl

class VideoMetadata(BaseModel):
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None

async def get_guest_token():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://api.twitter.com/1.1/guest/activate.json',
            headers={
                'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
            }
        )
        return response.json()['guest_token']

async def extract_video_info(url: str) -> VideoMetadata:
    # Extract tweet ID from URL
    tweet_id = re.findall(r'/status/(\d+)', url)[0]
    
    guest_token = await get_guest_token()
    
    headers = {
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'x-guest-token': guest_token,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'https://api.twitter.com/2/tweets/{tweet_id}?expansions=attachments.media_keys&media.fields=variants,url,duration_ms',
            headers=headers
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch video information")

        data = response.json()
        
        # Find the highest quality video URL
        video_variants = data['includes']['media'][0]['variants']
        video_url = max(
            [v for v in video_variants if v.get('content_type') == 'video/mp4'],
            key=lambda x: x.get('bit_rate', 0)
        )['url']

        return VideoMetadata(
            title=data['data']['text'][:100],
            video_url=video_url,
            thumbnail_url=data['includes']['media'][0].get('preview_image_url'),
            duration=data['includes']['media'][0].get('duration_ms', 0) // 1000
        )

def update_download_stats(video_url: str, video_title: str):
    conn = sqlite3.connect('downloads.db')
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO downloads (video_url, video_title, download_count)
        VALUES (?, ?, 1)
        ON CONFLICT(video_url) DO UPDATE SET 
        download_count = download_count + 1,
        last_downloaded = CURRENT_TIMESTAMP
    ''', (video_url, video_title))
    
    conn.commit()
    conn.close()

@app.post("/api/download")
async def download_video(video_request: VideoURL):
    try:
        video_info = await extract_video_info(str(video_request.url))
        update_download_stats(str(video_request.url), video_info.title)
        return video_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/popular")
async def get_popular_videos(limit: int = 5):
    conn = sqlite3.connect('downloads.db')
    c = conn.cursor()
    
    # Get popular videos from the last 30 days
    thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
    
    c.execute('''
        SELECT video_url, video_title, download_count
        FROM downloads
        WHERE last_downloaded > ?
        ORDER BY download_count DESC
        LIMIT ?
    ''', (thirty_days_ago, limit))
    
    results = [
        {
            "url": row[0],
            "title": row[1],
            "downloads": row[2]
        }
        for row in c.fetchall()
    ]
    
    conn.close()
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
