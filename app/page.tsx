"use client"

import { MapPin } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [fading, setFading] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)

  const scrollToSection = () => {
    const section = document.getElementById("data-section")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video && video.duration) {
      setShowEmojis(video.currentTime >= video.duration - 15)
    }
  }

  const handleEnded = () => {
    setFading(true)
    setTimeout(() => {
      const video = videoRef.current
      if (video) {
        video.currentTime = 0
        video.play()
      }
      setFading(false)
    }, 10000)
  }

  return (
    <div className="min-h-[200dvh] w-full flex flex-col font-sans relative">
      {/* Fixed background video */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-sky-200">
        <video
          ref={videoRef}
          src="/Travle.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
      {/* Fixed semi-transparent overlay */}
      <div className="fixed inset-0 z-0 bg-white/10" />
      {/* Fade overlay */}
      <div
        className="fixed inset-0 z-0 bg-black pointer-events-none transition-opacity duration-1000"
        style={{ opacity: fading ? 0.6 : 0 }}
      />

      {/* Hero Section - Full Screen */}
      <section className="min-h-dvh w-full flex flex-col relative z-10 overflow-hidden">
        {/* Floating Emojis */}
        <FloatingEmojis visible={showEmojis} />

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-dvh w-full">
          {/* Header */}
          <header className="w-full px-6 py-5 flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-blue-500/20">
                <MapPin className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight text-shadowed">
                맹모여지도
              </span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            {/* Badge */}
            <button
              onClick={scrollToSection}
              className="mb-6 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:bg-white/80 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200"
            >
              <span className="text-sm font-medium text-white text-shadowed">
                +50개 이상의 교육 시설 정보
              </span>
            </button>

            {/* Center Pin Icon */}
            <button
              onClick={scrollToSection}
              className="relative mb-6 group cursor-pointer focus:outline-none"
              aria-label="자세히 보기"
            >
              {/* Pulse animation */}
              <div className="absolute inset-0 -m-4 rounded-full bg-white/20 animate-ping" />
              <div className="absolute inset-0 -m-2 rounded-full bg-white/10 animate-pulse" />

              {/* Pin icon container */}
              <div className="relative w-28 h-28 bg-white rounded-3xl shadow-[0_8px_30px_rgba(59,130,246,0.35)] flex items-center justify-center group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)] group-active:scale-[0.98] group-active:translate-y-0 group-active:shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all duration-200">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-9 h-9 text-white" />
                </div>

                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </button>

            {/* Pointing finger with bounce animation */}
            <div className="animate-bounce mb-8">
              <span className="text-4xl">👆</span>
            </div>

            {/* Service description */}
            <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight text-center text-balance text-shadowed">
              우리 아이 성향에 딱 맞는
              <br />
              교육 동네, AI가 찾아드려요
            </h1>

            <p className="text-base text-white/90 leading-relaxed text-center max-w-xs text-shadowed">
              클릭해서 자세히 알아보세요
            </p>
          </main>

          {/* Scroll indicator */}
          <div className="w-full pb-8 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-white/70">
              <span className="text-xs text-shadowed">아래로 스크롤</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center p-1.5">
                <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section
        id="data-section"
        className="w-full py-16 px-6 relative z-10"
      >
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-8 text-center">
            어떤 데이터로 분석하나요?
          </h2>

          {/* Data Cards Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <DataCard
              emoji="🏫"
              title="학교 정보"
              description="학급당 학생수, 교사 1인당 학생수"
            />
            <DataCard
              emoji="📚"
              title="도서관 현황"
              description="지역별 공공도서관 분포"
            />
            <DataCard
              emoji="🏋️"
              title="문화·체육시설"
              description="공원, 체육관, 문화센터"
            />
            <DataCard
              emoji="🧒"
              title="돌봄 시설"
              description="돌봄교실, 공동육아나눔터"
            />
            <DataCard
              emoji="🛡️"
              title="안전 환경"
              description="어린이보호구역"
            />
            <DataCard
              emoji="💙"
              title="특수교육"
              description="특수학급, 특수교육지원센터"
            />
          </div>

          {/* Source note */}
          <p className="text-xs text-slate-500 text-center mb-10 leading-relaxed">
            본 서비스는 교육부·공공데이터포털 공공데이터를 활용합니다
          </p>

          {/* CTA Button with bounce animation */}
          <div className="animate-bounce-slow">
            <Link
              href="/diagnosis"
              className="w-full flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <MapPin className="w-6 h-6" />
              우리 아이 동네 궁합 분석하기
            </Link>
          </div>
        </div>
      </section>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .text-shadowed {
          text-shadow: 0 1px 6px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}

function FloatingEmojis({ visible }: { visible: boolean }) {
  const emojis = [
    { emoji: "📚", top: "15%", left: "8%", delay: "0s", duration: "3s" },
    { emoji: "🏫", top: "20%", right: "10%", delay: "0.5s", duration: "3.5s" },
    { emoji: "🎨", top: "45%", left: "5%", delay: "1s", duration: "4s" },
    { emoji: "🏋️", top: "50%", right: "8%", delay: "0.3s", duration: "3.2s" },
    { emoji: "🧒", top: "75%", left: "12%", delay: "0.8s", duration: "3.8s" },
    { emoji: "💙", top: "70%", right: "15%", delay: "0.2s", duration: "3.3s" },
    { emoji: "✏️", top: "30%", left: "15%", delay: "1.2s", duration: "4.2s" },
    { emoji: "🎵", top: "60%", right: "5%", delay: "0.7s", duration: "3.6s" },
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {emojis.map((item, index) => (
        <div
          key={index}
          className="absolute text-3xl animate-float opacity-80"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function DataCard({
  emoji,
  title,
  description,
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-2xl">{emoji}</span>
      </div>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}
