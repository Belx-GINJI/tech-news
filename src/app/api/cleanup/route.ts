import { NextResponse } from 'next/server';
import { cleanupOldCache } from '@/lib/storage';

/**
 * 30日以前の daily_articles キャッシュを削除
 * - Vercel Cron で毎日実行
 * - 手動で GET /api/cleanup を呼んでも実行可能
 */
export async function GET() {
  try {
    const result = await cleanupOldCache();
    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      message: `Cleaned up ${result.deleted} old cache entries`,
    });
  } catch (error) {
    console.error('[Cleanup] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
