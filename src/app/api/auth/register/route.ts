import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { id, nickname } = await request.json();
    const userId = String(id || '').trim();
    const nick = String(nickname || '').trim();

    if (!/^[0-9]{4}$/.test(userId)) {
      return NextResponse.json(
        { error: 'invalid_id', message: '4桁の数字を入力してください' },
        { status: 400 }
      );
    }

    if (!nick || nick.length > 10) {
      return NextResponse.json(
        { error: 'invalid_nickname', message: 'ニックネームは1〜10文字で入力してください' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'config_error' }, { status: 503 });
    }
    const { data, error } = await supabase
      .from('users')
      .insert({ id: userId, nickname: nick })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'id_taken', message: 'このIDは既に使用されています' },
          { status: 409 }
        );
      }
      console.error('[Auth] Register error:', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }

    await supabase.from('user_favorites').insert({ user_id: userId });

    return NextResponse.json({
      success: true,
      userId: data.id,
      nickname: data.nickname,
    });
  } catch (e) {
    console.error('[Auth] Register:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
