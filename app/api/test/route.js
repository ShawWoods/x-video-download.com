// app/api/test/route.js
export async function GET(request) {
    console.log('测试路由，方法: GET');
    const url = request.nextUrl.searchParams.get('url'); // 获取查询参数
    return new Response(JSON.stringify({ message: '测试成功', url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }