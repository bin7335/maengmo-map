export const SIDO_LIST = [
  { full: "서울특별시",       short: "서울" },
  { full: "부산광역시",       short: "부산" },
  { full: "대구광역시",       short: "대구" },
  { full: "인천광역시",       short: "인천" },
  { full: "광주광역시",       short: "광주" },
  { full: "대전광역시",       short: "대전" },
  { full: "울산광역시",       short: "울산" },
  { full: "세종특별자치시",   short: "세종" },
  { full: "경기도",           short: "경기" },
  { full: "강원특별자치도",   short: "강원" },
  { full: "충청북도",         short: "충북" },
  { full: "충청남도",         short: "충남" },
  { full: "전북특별자치도",   short: "전북" },
  { full: "전라남도",         short: "전남" },
  { full: "경상북도",         short: "경북" },
  { full: "경상남도",         short: "경남" },
  { full: "제주특별자치도",   short: "제주" },
] as const

export const SIDO_SHORT: Record<string, string> = Object.fromEntries(
  SIDO_LIST.map(({ full, short }) => [full, short])
)

export interface RealmWeight {
  realm: string
  weight: number
}

// NEIS CSV 실제 교습계열명 기준 (전처리 스크립트 출력값으로 검증됨)
// 예능(대): 음악·미술 / 기예(대): 무용·연기·무예체육 / 보통교과: 수학·과학 등 교과
export const TYPE_REALM_WEIGHTS: Record<string, RealmWeight[]> = {
  explorer: [
    { realm: "입시.검정 및 보습", weight: 3 }, // 입시·보습 학원
    { realm: "보통교과",          weight: 2 }, // 수학·과학·국어 등 교과
    { realm: "외국어",            weight: 1 }, // 어학
  ],
  active: [
    { realm: "기예(대)",          weight: 3 }, // 무용·무예·체육활동
    { realm: "예능(대)",          weight: 2 }, // 음악·미술
  ],
  social: [
    { realm: "예능(대)",          weight: 3 }, // 그룹 음악·미술 활동
    { realm: "기예(대)",          weight: 2 }, // 공연예술·단체활동
    { realm: "외국어",            weight: 1 }, // 언어 소통
  ],
  safe: [
    { realm: "입시.검정 및 보습", weight: 3 }, // 체계적 학습 관리
    { realm: "보통교과",          weight: 2 }, // 규칙적 교과 학습
    { realm: "종합(대)",          weight: 1 }, // 종합학원 (안정적 환경)
  ],
  creative: [
    { realm: "예능(대)",          weight: 3 }, // 예술·창작
    { realm: "기예(대)",          weight: 2 }, // 공연·표현
    { realm: "기타(대)",          weight: 1 }, // 다양한 창의 분야
  ],
}

export interface DistrictScore {
  sido: string
  sigungu: string
  score: number
  count: number
}

export type AcademyStats = Record<string, Record<string, Record<string, number>>>

export function computeDistrictScores(
  stats: AcademyStats,
  type: string,
  regions: string[]
): DistrictScore[] {
  const realmWeights = TYPE_REALM_WEIGHTS[type]
  if (!realmWeights) return []

  const raw: { sido: string; sigungu: string; rawScore: number; count: number }[] = []

  for (const sido of regions) {
    const sidoData = stats[sido]
    if (!sidoData) continue

    for (const [sigungu, realmCounts] of Object.entries(sidoData)) {
      let rawScore = 0
      let count = 0
      for (const { realm, weight } of realmWeights) {
        const c = realmCounts[realm] ?? 0
        rawScore += c * weight
        count += c
      }
      if (rawScore > 0) raw.push({ sido, sigungu, rawScore, count })
    }
  }

  const maxRaw = Math.max(...raw.map((d) => d.rawScore), 1)

  return raw
    .map(({ sido, sigungu, rawScore, count }) => ({
      sido,
      sigungu,
      score: Math.round((rawScore / maxRaw) * 100),
      count,
    }))
    .sort((a, b) => b.score - a.score)
}
