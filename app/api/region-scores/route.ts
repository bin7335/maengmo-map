import { NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { computeDistrictScores, AcademyStats } from "@/lib/academy-scoring"

function loadStats(): AcademyStats | null {
  const path = join(process.cwd(), "data", "academy-stats.json")
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, "utf-8"))
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type")
  const regionsParam = req.nextUrl.searchParams.get("regions")

  if (!type || !regionsParam) {
    return NextResponse.json({ error: "type, regions 파라미터가 필요해요" }, { status: 400 })
  }

  const stats = loadStats()
  if (!stats) {
    return NextResponse.json(
      { error: "academy-stats.json 파일이 없어요. 전처리 스크립트를 먼저 실행해주세요." },
      { status: 503 }
    )
  }

  const regions = regionsParam.split(",").map((r) => r.trim()).filter(Boolean)
  const results = computeDistrictScores(stats, type, regions).slice(0, 10)

  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  )
}
