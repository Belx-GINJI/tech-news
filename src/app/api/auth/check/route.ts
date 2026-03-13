import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    const userId = String(id || '').trim();

    if (!/^[0-9]{4}$/.test(userId)) {
      return NextResponse.json(
        { error: 'invalid_id', message: '4桁の数字を入力してください' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'config_error' }, { status: 503 });
    }
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Auth] Check error:', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ exists: false, userId });
    }

    return NextResponse.json({
      exists: true,
      userId: user.id,
      nickname: user.nickname,
    });
  } catch (e) {
    console.error('[Auth] Check:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
