import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.company_name) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    const { error } = await supabase
      .from("consultation_requests")
      .insert([{
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
      }]);

    if (error) throw error;

    await resend.emails.send({
      from: "프차그로우 <contact@frangrow.kr>",
      to: [
       "frangrow@naver.com",
       "brandity_official@naver.com",
       "jybest-consult@naver.com"
      ],
      subject: `[프차그로우] 새 상담신청 — ${body.company_name} ${body.name}`,
      html: `
        <h2 style="color:#D0190F">새 상담신청이 접수되었습니다</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;width:120px">이름</td><td style="padding:8px;border:1px solid #eee">${body.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">직책</td><td style="padding:8px;border:1px solid #eee">${body.role}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">연락처</td><td style="padding:8px;border:1px solid #eee">${body.phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">회사명</td><td style="padding:8px;border:1px solid #eee">${body.company_name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">업종</td><td style="padding:8px;border:1px solid #eee">${body.industry}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">관심 솔루션</td><td style="padding:8px;border:1px solid #eee">${(body.target_solutions || []).join(", ")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">문의내용</td><td style="padding:8px;border:1px solid #eee">${body.content}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">유입경로</td><td style="padding:8px;border:1px solid #eee">${body.utm_source} / ${body.utm_medium}</td></tr>
        </table>
        <p style="margin-top:16px;color:#888;font-size:12px">접수 시간: ${new Date().toLocaleString("ko-KR", {timeZone:"Asia/Seoul"})}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "서버 저장 중 오류" }, { status: 500 });
  }
}