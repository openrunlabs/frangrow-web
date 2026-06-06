import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.company_name) {
      return NextResponse.json(
        { error: "필수 입력 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("consultation_requests")
      .insert([
        {
          name: body.name,
          position: body.role || "",
          phone: body.phone,
          company: body.company_name,
          business_type: body.industry || "",
          message: body.content || "",
          agree_privacy: true,
          source: (body.target_solutions || []).join(", "),
          utm_source: body.utm_source || "",
          utm_medium: body.utm_medium || "",
          utm_campaign: body.utm_campaign || "",
          utm_content: body.utm_content || "",
          landing_page: body.landing_url || "",
          referrer: body.referrer || "",
          status: "new",
        },
      ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "서버 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}