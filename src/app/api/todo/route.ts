import { todo } from '@prisma/client'; // todoテーブル型
import prisma from '../lib/prisma';
import { NextResponse } from 'next/server';

// SELECT
export async function GET() {
    // todoテーブルから全件取得
    try {
        // findMany : 条件に合う全てのレコード取得
        // 今回は条件なので、SQLでいう「SELECT * FROM todo;」と同じ
        const todos: todo[] = await prisma.todo.findMany();
        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json(error);
    }
}

// INSERT
export async function POST(request: Request) {
    // todoテーブルに新規レコードを追加
    const body = await request.json();
    try {
        // Prismaのcreate関数を使用して新しいtodoレコードをDBに挿入
        // SQLでいう「INSERT INTO "todo" (title) values (body.title)」
        const todo: todo = await prisma.todo.create({
            data: { title: body.title },
        });
        // 新しく作成されたtodoレコードをJSON形式で返す
        return NextResponse.json(todo);
    } catch (error) {
        return NextResponse.json(error);
    }
}
