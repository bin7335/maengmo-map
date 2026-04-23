"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MapPin } from "lucide-react"
import Link from "next/link"

type ResultType = {
  key: string
  emoji: string
  name: string
  subtitle: string
  description: string
  traits: string[]
  tags: string[]
  tagColor: string
}

const resultTypes: ResultType[] = [
  {
    key: "explorer",
    emoji: "🌱",
    name: "탐구성장형",
    subtitle: "스스로 깊이 파고드는 탐구자",
    description:
      "혼자서도 집중하며 배움을 즐기는 아이예요. 조용하고 체계적인 환경에서 잠재력이 꽃피고, 도서관과 소규모 학급이 잘 맞아요.",
    traits: ["📖 독립적인 학습을 좋아해요", "🤫 조용한 환경에서 집중력이 높아요", "🎯 목표를 정하면 끝까지 파고들어요"],
    tags: ["소규모 학급", "도서관 근접", "개별 관심", "조용한 동네"],
    tagColor: "#eef4f0",
  },
  {
    key: "active",
    emoji: "🏃",
    name: "활동탐험형",
    subtitle: "몸으로 배우고 세상을 탐험하는 아이",
    description:
      "활발하고 에너지가 넘치는 아이예요. 직접 경험하고 움직이면서 배울 때 가장 빛나요. 체육시설과 다양한 활동이 풍부한 동네가 잘 맞아요.",
    traits: ["⚡ 활발하고 에너지가 넘쳐요", "🏅 직접 해봐야 제대로 배워요", "🌍 새로운 경험을 두려워하지 않아요"],
    tags: ["체육시설 근접", "문화·예술 활동", "넓은 공원", "다양한 경험"],
    tagColor: "#fff4e8",
  },
  {
    key: "social",
    emoji: "🤝",
    name: "따뜻한동반형",
    subtitle: "함께 자라는 것이 가장 큰 배움인 아이",
    description:
      "친구와의 관계에서 성장하는 아이예요. 협력하고 배려하는 환경에서 더 잘 자라요. 돌봄시설과 커뮤니티가 활발한 동네가 잘 맞아요.",
    traits: ["💛 타인을 잘 배려하고 공감해요", "👫 친구들과 함께할 때 즐거워요", "🌈 협력하는 분위기를 좋아해요"],
    tags: ["돌봄시설 충실", "협력하는 학교", "활발한 커뮤니티", "사회성 중심"],
    tagColor: "#fef4f4",
  },
  {
    key: "safe",
    emoji: "🏡",
    name: "안심성장형",
    subtitle: "안전하고 안정된 환경에서 꽃피는 아이",
    description:
      "안정적이고 예측 가능한 환경에서 마음껏 성장하는 아이예요. 믿을 수 있는 선생님과 안전한 등하굣길이 중요해요.",
    traits: ["🛡️ 안전한 환경에서 안정감을 느껴요", "📅 규칙적인 생활이 잘 맞아요", "👩‍🏫 선생님과의 신뢰가 중요해요"],
    tags: ["어린이보호구역", "소규모 학급", "세심한 교사", "안정적 루틴"],
    tagColor: "#f0f4ff",
  },
  {
    key: "creative",
    emoji: "🎨",
    name: "창의자유형",
    subtitle: "틀을 벗어나 마음껏 상상하는 아이",
    description:
      "독창적인 생각과 자유로운 표현이 강점인 아이예요. 예술·문화를 접하고 자기만의 방식으로 배울 때 빛나요.",
    traits: ["💡 엉뚱하지만 창의적인 아이디어가 넘쳐요", "🎭 예술적 감수성이 풍부해요", "🦋 자유로운 환경에서 더 잘 자라요"],
    tags: ["예술·문화 시설", "자기주도 학습", "다양한 경험", "창의적 환경"],
    tagColor: "#fdf0f8",
  },
]

// 유형별 가중치 (질문 0~19 인덱스)
const weights: Record<string, number[]> = {
  explorer: [0, 2, 0, 1, 1, 0, 1, 0, 2, 3, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0],
  active:   [2, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 2, 0, 0, 0, 1, 0, 0],
  social:   [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 0, 2],
  safe:     [0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 3, 0, 2, 2, 1, 0, 0, 0],
  creative: [0, 0, 0, 2, 0, 1, 0, 2, 0, 0, 0, 1, 0, 3, 0, 0, 0, 2, 0, 1],
}

function calcResult(answers: number[]): ResultType {
  const scores = Object.entries(weights).map(([key, w]) => ({
    key,
    score: w.reduce((sum, weight, i) => sum + weight * (answers[i] ?? 0), 0),
  }))
  const best = scores.sort((a, b) => b.score - a.score)[0]
  return resultTypes.find((t) => t.key === best.key) ?? resultTypes[0]
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<ResultType | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnosis_answers")
    if (!raw) { router.replace("/diagnosis"); return }
    const answers: number[] = JSON.parse(raw)
    setResult(calcResult(answers))
    setTimeout(() => setVisible(true), 100)
  }, [router])

  if (!result) return null

  return (
    <div className="min-h-dvh w-full flex flex-col font-sans bg-[#faf7f2]">
      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/diagnosis")}
          className="w-10 h-10 rounded-full bg-[#eef4f0] flex items-center justify-center text-[#1a3d2b] hover:bg-[#ddeee5] active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a3d2b] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#f5f0e8]" />
          </div>
          <span className="text-base font-extrabold text-[#1a3d2b] tracking-tight">맹모여지도</span>
        </div>
        <div className="w-10" />
      </header>

      <main
        className="flex-1 flex flex-col px-5 py-4 max-w-md mx-auto w-full gap-4 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
      >
        {/* 결과 타이틀 */}
        <p className="text-sm font-medium text-[#6b7c74] text-center">우리 아이의 교육 성향은</p>

        {/* 유형 카드 */}
        <div className="bg-[#1a3d2b] rounded-3xl p-6 shadow-[0_8px_32px_rgba(26,61,43,0.25)]">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center">
              <span className="text-5xl">{result.emoji}</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#f5f0e8] mb-1">{result.name}</h1>
              <p className="text-sm text-[#a8c5b5]">{result.subtitle}</p>
            </div>
            <p className="text-sm text-[#c8ddd4] leading-relaxed mt-1">{result.description}</p>
          </div>
        </div>

        {/* 성향 특징 */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_16px_rgba(26,61,43,0.08)]">
          <h2 className="text-sm font-extrabold text-[#1a3d2b] mb-3">이런 아이예요</h2>
          <div className="flex flex-col gap-2.5">
            {result.traits.map((trait, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] flex-shrink-0" />
                <p className="text-sm text-[#3d5a4a]">{trait}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 교육 환경 태그 */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_16px_rgba(26,61,43,0.08)]">
          <h2 className="text-sm font-extrabold text-[#1a3d2b] mb-3">추천 교육 환경</h2>
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-[#1a3d2b]"
                style={{ backgroundColor: result.tagColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 pb-8">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2b] text-[#f5f0e8] font-bold text-base shadow-[0_8px_24px_rgba(26,61,43,0.3)] hover:bg-[#2d6a4f] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200"
          >
            <MapPin className="w-5 h-5" />
            이런 환경의 동네 보러 가기
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem("diagnosis_answers"); router.push("/diagnosis") }}
            className="w-full py-4 rounded-full border-2 border-[#e8e2d9] text-[#6b7c74] font-bold text-base hover:border-[#2d6a4f] hover:text-[#1a3d2b] transition-all duration-200"
          >
            다시 진단하기
          </button>
        </div>
      </main>
    </div>
  )
}
