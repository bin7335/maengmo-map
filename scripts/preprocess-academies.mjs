import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = resolve(__dirname, "../data/academies_raw.csv")
const OUT_PATH = resolve(__dirname, "../data/academy-stats.json")

if (!existsSync(CSV_PATH)) {
  console.error(`❌ CSV 파일을 찾을 수 없어요: ${CSV_PATH}`)
  console.error("   data/academies_raw.csv 경로에 NEIS에서 다운받은 CSV를 넣어주세요.")
  process.exit(1)
}

function parseLine(line) {
  const result = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function findColIndex(headers, keywords) {
  const idx = headers.findIndex((h) =>
    keywords.some((kw) => h.includes(kw))
  )
  if (idx === -1) {
    console.warn(`⚠️  컬럼을 찾지 못했어요 (키워드: ${keywords.join(", ")})`)
    console.warn("   실제 헤더:", headers.join(" | "))
  }
  return idx
}

console.log("📂 CSV 읽는 중...")
const raw = readFileSync(CSV_PATH, "utf-8")
const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")

// BOM 제거
const firstLine = lines[0].replace(/^\uFEFF/, "")
const headers = parseLine(firstLine)

console.log(`📋 헤더 (${headers.length}개):`, headers.join(" | "))
console.log("")

const sidoIdx = findColIndex(headers, ["시도교육청명", "시도명", "시도"])
const sigunguIdx = findColIndex(headers, ["행정구역명", "시군구명", "행정구역"])
const realmIdx = findColIndex(headers, ["교습계열명", "교습계열", "계열명"])

if (sidoIdx === -1 || sigunguIdx === -1 || realmIdx === -1) {
  console.error("❌ 필수 컬럼을 찾지 못했어요. 위 헤더 목록을 확인해서 알려주세요.")
  process.exit(1)
}

console.log(`✅ 시도: [${sidoIdx}] "${headers[sidoIdx]}"`)
console.log(`✅ 시군구: [${sigunguIdx}] "${headers[sigunguIdx]}"`)
console.log(`✅ 교습계열: [${realmIdx}] "${headers[realmIdx]}"`)
console.log("")
console.log("⚙️  집계 중...")

const stats = {}
let processed = 0
let skipped = 0

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue

  const cols = parseLine(line)
  const sido = cols[sidoIdx]?.trim()
  const sigungu = cols[sigunguIdx]?.trim()
  const realm = cols[realmIdx]?.trim()

  if (!sido || !sigungu || !realm) { skipped++; continue }

  if (!stats[sido]) stats[sido] = {}
  if (!stats[sido][sigungu]) stats[sido][sigungu] = {}
  stats[sido][sigungu][realm] = (stats[sido][sigungu][realm] ?? 0) + 1
  processed++
}

writeFileSync(OUT_PATH, JSON.stringify(stats, null, 2), "utf-8")

const sidoCount = Object.keys(stats).length
const sigunguCount = Object.values(stats).flatMap((s) => Object.keys(s)).length

console.log(`✅ 완료!`)
console.log(`   - 처리: ${processed.toLocaleString()}개 학원·교습소`)
console.log(`   - 스킵: ${skipped.toLocaleString()}개 (빈 필드)`)
console.log(`   - 시도: ${sidoCount}개, 시군구: ${sigunguCount}개`)
console.log(`   - 저장: data/academy-stats.json`)
console.log("")
console.log("🗺️  감지된 시도 목록:")
Object.entries(stats).forEach(([sido, sgMap]) => {
  const total = Object.values(sgMap).reduce(
    (sum, realms) => sum + Object.values(realms).reduce((s, c) => s + c, 0),
    0
  )
  console.log(`   ${sido}: ${Object.keys(sgMap).length}개 시군구, ${total.toLocaleString()}개 학원`)
})
