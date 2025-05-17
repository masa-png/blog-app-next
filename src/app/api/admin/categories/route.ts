import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

interface CreateCategoryRequestBody {
  name: string;
}

export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  // tokenが正しい場合、以降が実行される
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

export const POST = async (request: NextRequest, context: any) => {
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  // tokenが正しい場合、以降が実行される
  try {
    const body = await request.json();

    const { name }: CreateCategoryRequestBody = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
