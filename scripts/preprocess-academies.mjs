import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = resolve(__dirname, "../data/academies_raw.csv")
const OUT_PATH = resolve(__dirname, "../data/academy-stats.json")

if (!existsSync(CSV_PATH)) {
  console.error(`❌ CSV 파일을 찾을 수 없어요: ${CSV_PATH}`)
  console.error("   data/academies_raw.csv 경로에 NEIS에서 다운받은 파일을 넣어주세요.")
  process.exit(1)
}

// NEIS 시도코드 → 시도명 매핑
const SIDO_CODE_MAP = {
  B10: "서울특별시",
  C10: "부산광역시",
  D10: "대구광역시",
  E10: "인천광역시",
  F10: "광주광역시",
  G10: "대전광역시",
  H10: "울산광역시",
  I10: "세종특별자치시",
  J10: "경기도",
  K10: "강원특별자치도",
  M10: "충청북도",
  N10: "충청남도",
  P10: "전북특별자치도",
  Q10: "전라남도",
  R10: "경상북도",
  S10: "경상남도",
  T10: "제주특별자치도",
}

// 알려진 컬럼 구조 (NEIS 학원교습소정보 TSV 기준)
// 0: 시도코드, 2: 행정구역명, 13: 교습계열명, 20: 도로명주소
const COL = { sidoCode: 0, sigungu: 2, realm: 13 }

console.log("📂 파일 읽는 중...")
const raw = readFileSync(CSV_PATH, "utf-8")
const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")

// BOM 제거
lines[0] = lines[0].replace(/^\uFEFF/, "")

// 첫 행이 헤더인지 데이터인지 판단
const firstCols = lines[0].split("\t")
const hasHeader = !Object.keys(SIDO_CODE_MAP).includes(firstCols[0].trim())
const startIdx = hasHeader ? 1 : 0

if (hasHeader) {
  console.log("📋 헤더 행 감지됨:", firstCols.slice(0, 15).join(" | "))
} else {
  console.log("📋 헤더 없음 — 고정 컬럼 인덱스 사용")
  console.log(`   [${COL.sidoCode}] 시도코드, [${COL.sigungu}] 행정구역명, [${COL.realm}] 교습계열명`)
}

console.log(`⚙️  집계 중... (총 ${(lines.length - startIdx).toLocaleString()}행)`)

const stats = {}
const realmSet = new Set()
let processed = 0
let skipped = 0

for (let i = startIdx; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue

  const cols = line.split("\t")

  const sidoCode = cols[COL.sidoCode]?.trim()
  const sigungu  = cols[COL.sigungu]?.trim()
  const realm    = cols[COL.realm]?.trim()

  const sido = SIDO_CODE_MAP[sidoCode]

  if (!sido || !sigungu || !realm) { skipped++; continue }

  realmSet.add(realm)

  if (!stats[sido]) stats[sido] = {}
  if (!stats[sido][sigungu]) stats[sido][sigungu] = {}
  stats[sido][sigungu][realm] = (stats[sido][sigungu][realm] ?? 0) + 1
  processed++
}

writeFileSync(OUT_PATH, JSON.stringify(stats, null, 2), "utf-8")

const sidoCount   = Object.keys(stats).length
const sigunguCount = Object.values(stats).flatMap((s) => Object.keys(s)).length

console.log("")
console.log("✅ 완료!")
console.log(`   - 처리: ${processed.toLocaleString()}개 학원·교습소`)
console.log(`   - 스킵: ${skipped.toLocaleString()}개 (시도코드 불일치 또는 빈 필드)`)
console.log(`   - 시도: ${sidoCount}개, 시군구: ${sigunguCount}개`)
console.log(`   - 저장: data/academy-stats.json`)
console.log("")
console.log("📚 발견된 교습계열명 목록:")
;[...realmSet].sort().forEach((r) => console.log(`   "${r}"`))
console.log("")
console.log("🗺️  시도별 집계:")
Object.entries(stats).forEach(([sido, sgMap]) => {
  const total = Object.values(sgMap).reduce(
    (sum, realms) => sum + Object.values(realms).reduce((s, c) => s + c, 0), 0
  )
  console.log(`   ${sido}: ${Object.keys(sgMap).length}개 시군구, ${total.toLocaleString()}개`)
})
