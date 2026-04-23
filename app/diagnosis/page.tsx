"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MapPin } from "lucide-react"

const questions = [
  { id: 1,  text: "아이는 여러 사람 앞에 나서는 걸 즐기는 편이에요" },
  { id: 2,  text: "아이는 먼저 나서기보다 상황을 먼저 지켜보는 편이에요" },
  { id: 3,  text: "아이는 직접 만들고 체험하는 활동을 특히 좋아해요" },
  { id: 4,  text: "아이는 상상력이 풍부하고 엉뚱한 아이디어를 잘 내는 편이에요" },
  { id: 5,  text: "아이는 \"왜 그래야 해?\"라고 이유를 따지는 편이에요" },
  { id: 6,  text: "아이는 친구가 힘들어 보이면 먼저 다가가는 편이에요" },
  { id: 7,  text: "아이는 정해진 규칙과 루틴 안에서 더 안정감을 느껴요" },
  { id: 8,  text: "아이는 갑작스러운 변화에도 유연하게 잘 적응하는 편이에요" },
  { id: 9,  text: "담임 선생님이 아이를 개별적으로 세심히 챙겨주길 바라요" },
  { id: 10, text: "학교 근처에 도서관이나 독서 공간이 있었으면 해요" },
  { id: 11, text: "방과 후 돌봄 서비스를 이용할 계획이에요" },
  { id: 12, text: "아이가 마음껏 뛰어놀 수 있는 체육시설이 근처에 있었으면 해요" },
  { id: 13, text: "등하굣길 안전이 학교 선택에서 매우 중요한 요소예요" },
  { id: 14, text: "미술·음악 등 예술 문화 활동을 접할 수 있는 환경이 중요해요" },
  { id: 15, text: "아이에게 개별적인 학습 지원이나 세심한 케어가 필요한 편이에요" },
  { id: 16, text: "한 반 학생 수가 적을수록 좋다고 생각해요" },
  { id: 17, text: "성적이 좋지 않아도 아이가 즐겁게 학교를 다니면 충분해요" },
  { id: 18, text: "공부보다 아이가 하고 싶은 걸 찾아주는 게 더 중요해요" },
  { id: 19, text: "좋은 대학을 위한 준비는 초등학교 때부터 시작해야 해요" },
  { id: 20, text: "아이가 경쟁보다 협력하는 환경에서 자랐으면 해요" },
]

const scaleOptions = [
  { label: "아니에요", value: 0, emoji: "🙅" },
  { label: "보통이에요", value: 1, emoji: "🤷" },
  { label: "맞아요", value: 2, emoji: "🙆" },
]

export default function DiagnosisPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [animating, setAnimating] = useState(false)

  const total = questions.length
  const progress = ((current + 1) / total) * 100
  const selected = answers[current]
  const isLast = current + 1 >= total

  const handleSelect = (value: number) => {
    if (animating) return
    const next = [...answers]
    next[current] = value
    setAnswers(next)
  }

  const handleNext = () => {
    if (selected === -1 || animating) return
    setAnimating(true)
    setTimeout(() => {
      if (isLast) {
        sessionStorage.setItem("diagnosis_answers", JSON.stringify(answers))
        router.push("/result")
      } else {
        setCurrent((prev) => prev + 1)
        setAnimating(false)
      }
    }, 250)
  }

  const handleBack = () => {
    if (current === 0) { router.back(); return }
    setCurrent((prev) => prev - 1)
  }

  return (
    <div className="min-h-dvh w-full flex flex-col font-sans bg-[#faf7f2]">
      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-[#eef4f0] flex items-center justify-center text-[#1a3d2b] hover:bg-[#ddeee5] active:scale-95 transition-all duration-150"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1a3d2b] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#f5f0e8]" />
          </div>
          <span className="text-base font-extrabold text-[#1a3d2b] tracking-tight">
            맹모여지도
          </span>
        </div>

        <span className="text-sm font-bold text-[#6b7c74]">
          {current + 1}/{total}
        </span>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="w-full h-1.5 bg-[#e8e2d9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a3d2b] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col px-5 py-4 max-w-md mx-auto w-full">
        {/* Question */}
        <div
          className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(26,61,43,0.1)] p-6 mb-6"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#eef4f0] text-[#1a3d2b] text-xs font-extrabold flex-shrink-0 mt-0.5">
              Q{current + 1}
            </span>
            <h2 className="text-lg font-bold text-[#1a3d2b] leading-snug">
              {questions[current].text}
            </h2>
          </div>
        </div>

        {/* Scale Options */}
        <div
          className="grid grid-cols-3 gap-3 mb-6"
          style={{
            opacity: animating ? 0 : 1,
            transition: "opacity 0.2s ease 0.05s",
          }}
        >
          {scaleOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]
                ${selected === opt.value
                  ? "bg-[#1a3d2b] border-[#1a3d2b] shadow-[0_6px_20px_rgba(26,61,43,0.35)] -translate-y-0.5"
                  : "bg-white border-[#e8e2d9] hover:border-[#2d6a4f] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,61,43,0.12)]"
                }
              `}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`text-sm font-bold ${selected === opt.value ? "text-[#f5f0e8]" : "text-[#1a3d2b]"}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selected === -1}
          className={`
            w-full py-4 rounded-full font-bold text-base transition-all duration-200
            ${selected !== -1
              ? "bg-[#1a3d2b] text-[#f5f0e8] shadow-[0_8px_24px_rgba(26,61,43,0.3)] hover:bg-[#2d6a4f] hover:-translate-y-0.5 active:translate-y-0.5"
              : "bg-[#e8e2d9] text-[#a09890] cursor-not-allowed"
            }
          `}
        >
          {isLast ? "결과 보기 🎉" : "다음 →"}
        </button>
      </main>
    </div>
  )
}
