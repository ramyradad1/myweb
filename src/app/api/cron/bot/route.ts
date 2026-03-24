import { NextResponse } from 'next/server';
import { runSchedulerCron } from '@/lib/bot/scheduler';

/**
 * Bot Cron API Route
 * This endpoint is called by a cron scheduler (e.g., Vercel Cron)
 * to trigger the automated scraping, rewriting, and publishing pipeline.
 *
 * Usage: Set up a Vercel Cron job in vercel.json with schedule "0 0/6 * * *"
 */
export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request (Vercel sends this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = new Date().toISOString();
    console.log(`[Bot Cron] Triggered at ${timestamp}`);

    const result = await runSchedulerCron();

    return NextResponse.json({
      success: true,
      message: `Bot pipeline triggered successfully. Published ${result.successCount} articles.`,
      timestamp,
      result: result
    });
  } catch (error) {
    console.error('[Bot Cron] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
