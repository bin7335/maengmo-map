"use client"

import { MapPin } from "lucide-react"
import Link from "next/link"

export default function ResultPage() {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center font-sans relative px-6">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-blue-300 via-40% to-white to-90% -z-10" />

      <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-[0_8px_30px_rgba(59,130,246,0.35)] flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-sm mb-2">
            분석 결과 준비 중
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            결과 페이지는 곧 완성될 예정이에요!
          </p>
        </div>

        <Link
          href="/"
          className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white font-bold text-base hover:bg-white/30 active:scale-[0.98] transition-all duration-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
