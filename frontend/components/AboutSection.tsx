import React from 'react';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface Tech {
  icon: string;
  name: string;
  desc: string;
}

interface RoadmapItem {
  icon: string;
  text: string;
}

const AboutSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:px-8">
        {/* Header */}
        <header className="text-center mb-20 animate-fade-in-down">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-500/50">
              🅿️
            </div>
            <h1 className="text-5xl font-bold tracking-tight font-mono">Mac-A-Park</h1>
          </div>
          <p className="text-3xl font-light text-slate-300 mb-4">Smart Parking Made Simple</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Find available parking spots instantly using computer vision and real-time monitoring
          </p>
        </header>
        {/* Vision */}
        <section className="mb-24 animate-fade-in-up delay-500">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Our Vision
          </h2>
          <div className="bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border-2 border-emerald-500/50 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
              <span className="text-4xl">🚗</span> The Future of Parking
            </h3>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
              We envision a world where finding parking is effortless. Soon, Mac-A-Park will automatically activate when you enter a parking lot—seamlessly integrated into your vehicle's system to guide you to the perfect spot before you even start looking.
            </p>
          </div>
        </section>
        {/* Problem & Solution Grid */}
        <section className="mb-24 animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Why Mac-A-Park?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-t-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-3xl">❌</span> The Problem
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Every day, drivers waste time, fuel, and patience circling parking lots searching for available spots. Traditional smart parking systems require expensive sensors for each space, making them impractical to deploy at scale.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-t-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-3xl">✅</span> Our Solution
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Mac-A-Park uses existing CCTV cameras and advanced computer vision to detect parking occupancy in real time. No expensive hardware installations—just intelligent software working with infrastructure already in place.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-24 animate-fade-in-up delay-200">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {([
              { icon: '📹', title: 'Existing Infrastructure', desc: 'Works with CCTV cameras already installed—no new hardware needed' },
              { icon: '⚡', title: 'Real-Time Updates', desc: 'Instant parking availability displayed on your dashboard' },
              { icon: '🎯', title: 'Smart Guidance', desc: 'Highlights best spots based on your preferences and needs' },
              { icon: '📍', title: 'GPS Integration', desc: 'Shows your location on the lot map for easy navigation' },
              { icon: '💰', title: 'Cost-Effective', desc: 'Dramatically reduces deployment and maintenance costs' },
              { icon: '🌱', title: 'Eco-Conscious', desc: 'Reduces emissions by eliminating unnecessary driving' },
            ] as Feature[]).map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:translate-x-2 transition-all duration-300"
              >
                <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-24 animate-fade-in-up delay-300">
          {/* Legend */}
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-12 p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/50"></div>
              <span className="text-lg"><strong>Green</strong> = Empty Spot</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-lg shadow-lg shadow-red-500/50"></div>
              <span className="text-lg"><strong>Red</strong> = Occupied</span>
            </div>

          </div>
        </section>

        {/* Technology */}
        <section className="mb-24 animate-fade-in-up delay-400">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            The Technology Behind It
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { icon: '🎥', name: 'OpenCV', desc: 'Video processing & analysis' },
              { icon: '🧠', name: 'YOLO', desc: 'Object detection AI' },
              { icon: '⚙️', name: 'Real-Time Backend', desc: 'API & WebSocket updates' },
              { icon: '🖥️', name: 'Interactive UI', desc: 'Live dashboard with GPS' },
            ] as Tech[]).map((tech, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 hover:scale-105 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{tech.icon}</div>
                <div className="font-semibold text-lg mb-2">{tech.name}</div>
                <div className="text-sm text-slate-400">{tech.desc}</div>
              </div>
            ))}
          </div>
        </section>




      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, 20px) scale(1.1);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-20px, -20px) scale(1.1);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-300 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-400 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-500 {
          animation-delay: 0.8s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-600 {
          animation-delay: 1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutSection;
