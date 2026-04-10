import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

type SaveBody = {
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
};

export async function POST(req: Request) {
  const body = (await req.json()) as SaveBody;
  if (!body.faqs?.length) {
    return NextResponse.json({ error: "faqs array required." }, { status: 400 });
  }

  const json = JSON.stringify(body.faqs, null, 2);
  const filePath = path.join(process.cwd(), "data", "faqs.json");

  const allowWrite =
    process.env.ALLOW_FAQ_FILE_WRITE === "true" || process.env.NODE_ENV === "development";

  if (allowWrite) {
    try {
      await writeFile(filePath, `${json}\n`, "utf8");
      return NextResponse.json({ ok: true, wroteFile: true, path: "data/faqs.json" });
    } catch (e) {
      return NextResponse.json(
        {
          ok: false,
          error: String(e),
          download: json,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    wroteFile: false,
    message:
      "Production filesystem is read-only. Copy the JSON below into data/faqs.json locally or enable ALLOW_FAQ_FILE_WRITE with appropriate hosting.",
    download: json,
  });
}
