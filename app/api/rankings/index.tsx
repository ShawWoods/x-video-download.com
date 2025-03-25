// app/api/rankings/route.js
import db from '../../../db';

export async function GET() {
  return new Promise((resolve) => {
    db.all(
      `SELECT url, title, download_count 
       FROM downloads 
       ORDER BY download_count DESC 
       LIMIT 10`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Ranking error:', err);
          resolve(new Response(JSON.stringify({ error: 'Failed to fetch rankings' }), { status: 500 }));
        } else {
          resolve(new Response(JSON.stringify(rows), { status: 200 }));
        }
      }
    );
  });
}