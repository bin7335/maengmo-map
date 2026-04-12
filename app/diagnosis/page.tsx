"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, ChevronLeft } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "어떤 아이인가요?",
    options: [
      { label: "일반 학생이에요", emoji: "🎒" },
      { label: "특수교육이 필요해요", emoji: "💙" },
    ],
  },
  {
    id: 2,
    question: "아이가 가장 좋아하는 활동은 무엇인가요?",
    options: [
      { label: "책 읽기", emoji: "📚" },
      { label: "운동하기", emoji: "⚽" },
      { label: "예술 활동", emoji: "🎨" },
      { label: "친구와 어울리기", emoji: "🧑‍🤝‍🧑" },
    ],
  },
  {
    id: 3,
    question: "학교생활에서 가장 중요한 것은?",
    options: [
      { label: "학업 성취", emoji: "📝" },
      { label: "친구 관계", emoji: "👫" },
      { label: "다양한 경험", emoji: "🌈" },
      { label: "안전한 환경", emoji: "🛡️" },
    ],
  },
  {
    id: 4,
    question: "아이의 성향에 가까운 것은?",
    options: [
      { label: "조용하고 집중력이 좋아요", emoji: "🤫" },
      { label: "활발하고 에너지가 넘쳐요", emoji: "🗣️" },
    ],
  },
  {
    id: 5,
    question: "선호하는 학급 규모는?",
    options: [
      { label: "소규모 학급\n(개별 관심 집중)", emoji: "🧑‍🏫" },
      { label: "대규모 학급\n(다양한 친구들)", emoji: "🏫" },
    ],
  },
  {
    id: 6,
    question: "방과 후 시간을 어떻게 보내길 원하나요?",
    options: [
      { label: "집에서 편히 쉬기", emoji: "🏠" },
      { label: "돌봄 시설 이용", emoji: "🧒" },
      { label: "문화·체육 활동", emoji: "🎵" },
      { label: "학원·과외", emoji: "📖" },
    ],
  },
  {
    id: 7,
    question: "통학 거리는 얼마나 중요한가요?",
    options: [
      { label: "가까울수록 좋아요", emoji: "🚶" },
      { label: "어느 정도는 괜찮아요", emoji: "🚌" },
    ],
  },
  {
    id: 8,
    question: "자연환경이 얼마나 중요한가요?",
    options: [
      { label: "매우 중요해요", emoji: "🌳" },
      { label: "보통이에요", emoji: "🌿" },
      { label: "별로 안 중요해요", emoji: "🏙️" },
    ],
  },
  {
    id: 9,
    question: "추가 교육 지원이 얼마나 필요한가요?",
    options: [
      { label: "많은 지원이 필요해요", emoji: "🤝" },
      { label: "적당히 필요해요", emoji: "👌" },
      { label: "스스로 잘 해요", emoji: "💪" },
    ],
  },
]

export default function DiagnosisPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  const question = questions[current]
  const total = questions.length
  const progress = ((current + 1) / total) * 100

  const handleSelect = (index: number) => {
    if (animating) return
    setSelected(index)
  }

  const handleNext = () => {
    if (selected === null || animating) return
    setAnimating(true)

    setTimeout(() => {
      if (current + 1 >= total) {
        router.push("/result")
      } else {
        setCurrent((prev) => prev + 1)
        setSelected(null)
        setAnimating(false)
      }
    }, 300)
  }

  const handleBack = () => {
    if (current === 0) {
      router.back()
      return
    }
    setCurrent((prev) => prev - 1)
    setSelected(null)
  }

  const isLast = current + 1 >= total
  const cols = question.options.length === 2 ? "grid-cols-1" : "grid-cols-2"

  return (
    <div className="min-h-dvh w-full flex flex-col font-sans relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 via-40% to-blue-50 -z-10" />

      {/* Header */}
      <header className="w-full px-4 py-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all duration-150"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight drop-shadow-sm">
            맹모여지도
          </span>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-sm font-bold text-white/80">
            {current + 1}/{total}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pb-2">
        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i <= current ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 py-6 max-w-md mx-auto w-full">
        {/* Question Card */}
        <div
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_8px_40px_rgba(59,130,246,0.25)] p-6 mb-5"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <div className="flex items-start gap-3 mb-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-extrabold flex-shrink-0 mt-0.5">
              Q{current + 1}
            </span>
            <h2 className="text-lg font-extrabold text-slate-800 leading-snug">
              {question.question}
            </h2>
          </div>
        </div>

        {/* Options */}
        <div
          className={`grid ${cols} gap-3 mb-6`}
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.25s ease 0.05s, transform 0.25s ease 0.05s",
          }}
        >
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl
                border-2 transition-all duration-200 active:scale-[0.97]
                ${
                  selected === index
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent shadow-[0_6px_24px_rgba(59,130,246,0.45)] -translate-y-0.5"
                    : "bg-white/90 border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 hover:border-blue-200"
                }
              `}
            >
              {selected === index && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
              <span className="text-3xl">{option.emoji}</span>
              <span
                className={`text-sm font-bold text-center leading-snug whitespace-pre-line ${
                  selected === index ? "text-white" : "text-slate-700"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`
            w-full py-4 rounded-full font-bold text-base transition-all duration-200
            ${
              selected !== null
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
                : "bg-white/40 text-white/60 cursor-not-allowed"
            }
          `}
        >
          {isLast ? "결과 보기 🎉" : "다음 →"}
        </button>
      </main>
    </div>
  )
}
