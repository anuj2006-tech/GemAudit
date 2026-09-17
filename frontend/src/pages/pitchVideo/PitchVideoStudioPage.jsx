import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Download, Maximize, 
  CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Clock, 
  FileText, Database, Sparkles, Building2, Layers, Cpu, Check, 
  Flame, Lock, ChevronRight, Video, ArrowLeft
} from 'lucide-react';

const SCENES = [
  {
    id: 1,
    title: "The Paperwork Problem",
    duration: 22.1,
    audioUrl: "/audio/pitch/scene1.mp3",
    tag: "THE BIG PROBLEM",
    voiceover: "Every single year, the Indian government awards lakhs of crores in public contracts. Yet, procurement officers still spend days manually sifting through stacks of paper. Meanwhile, dishonest contractors exploit these loopholes with forged certificates, stalling critical national projects for years.",
    subtitles: [
      { text: "Every single year, the government awards lakhs of crores in contracts.", start: 0, end: 6 },
      { text: "Yet, procurement officers still spend days checking stacks of paper by hand.", start: 6, end: 13 },
      { text: "Dishonest bidders exploit loopholes with fake certificates, delaying projects for years.", start: 13, end: 22 }
    ]
  },
  {
    id: 2,
    title: "Meet GeM Audit (Bid Document Verification)",
    duration: 19.9,
    audioUrl: "/audio/pitch/scene2.mp3",
    tag: "STEP 1: 3-SECOND AUDIT",
    voiceover: "Enter GeM Audit. Instead of days of grueling manual checks, our AI inspects the entire bid dossier and cross-verifies credentials against ten live government registries in just three seconds. Instantly, it catches fraudulent claims and alerts the evaluation committee.",
    subtitles: [
      { text: "Enter GeM Audit: replacing days of grueling manual checks.", start: 0, end: 5 },
      { text: "Our AI inspects the entire bid against 10 government registries in 3 seconds.", start: 5, end: 13 },
      { text: "Instantly, it catches fraudulent claims and alerts the evaluation committee.", start: 13, end: 20 }
    ]
  },
  {
    id: 3,
    title: "Catching Fake Claims Live",
    duration: 23.2,
    audioUrl: "/audio/pitch/scene3.mp3",
    tag: "STEP 2: LIVE DETECTION",
    voiceover: "Here is that live forensic verification in action. In their bid submission, a contractor claimed eighteen crore rupees in annual turnover. But when our system pinged the live GST portal, their real filed revenue was barely four crore. The AI catches the fabrication on the spot and drafts a legally sealed rejection notice.",
    subtitles: [
      { text: "Here is that live forensic verification in action.", start: 0, end: 5 },
      { text: "Bid document claimed ₹18 Crore turnover, but live GST portal showed barely ₹4 Crore.", start: 5, end: 14 },
      { text: "The AI catches the fabrication on the spot and auto-drafts a sealed rejection notice.", start: 14, end: 23 }
    ]
  },
  {
    id: 4,
    title: "Permanent Digital Proof",
    duration: 19.7,
    audioUrl: "/audio/pitch/scene4.mp3",
    tag: "SAFETY & TRUST",
    voiceover: "To guarantee complete integrity and shield honest officers from false allegations, GeM Audit cryptographically seals every single audit decision with SHA-256 digital stamps. This produces an unalterable forensic record that stands up in any court or vigilance inquiry.",
    subtitles: [
      { text: "To guarantee integrity and shield honest officers from false allegations,", start: 0, end: 6 },
      { text: "GeM Audit cryptographically seals every audit decision with SHA-256 digital stamps.", start: 6, end: 13 },
      { text: "Produces an unalterable forensic record that stands up in any court or inquiry.", start: 13, end: 20 }
    ]
  },
  {
    id: 5,
    title: "The 48-Hour Help Bot",
    duration: 21.2,
    audioUrl: "/audio/pitch/scene5.mp3",
    tag: "48-HOUR GeM DEADLINE",
    voiceover: "On the GeM portal, when officers raise technical queries, vendors have only forty-eight hours to respond or face automatic disqualification. Our AI clarifies everything in forty-five seconds—retrieving the exact verified certificates from their vault and drafting a formal, compliant representation on time.",
    subtitles: [
      { text: "On GeM, vendors have only 48 hours to answer technical queries or face rejection.", start: 0, end: 7 },
      { text: "Our AI clarifies everything in 45 seconds—retrieving verified certificates from their vault.", start: 7, end: 14 },
      { text: "Drafts a formal, compliant representation on time, saving bids from disqualification.", start: 14, end: 21 }
    ]
  },
  {
    id: 6,
    title: "Fast, Clean & Honest Bids",
    duration: 17.4,
    audioUrl: "/audio/pitch/scene6.mp3",
    tag: "NATIONAL IMPACT",
    voiceover: "GeM Audit slashes tender evaluation time from seven days down to just eight minutes—eliminating fake bids and saving thousands of crores. We are building a faster, smarter, and truly corruption-free public procurement ecosystem for India.",
    subtitles: [
      { text: "Evaluation time slashed from 7 days down to just 8 minutes—96% faster.", start: 0, end: 6 },
      { text: "Eliminating fake bids completely and saving thousands of crores.", start: 6, end: 11 },
      { text: "Building a faster, smarter, and truly corruption-free procurement ecosystem for India.", start: 11, end: 17 }
    ]
  }
];

const REGISTRIES = [
  { name: 'Tax Sales Records', tag: 'Reported Revenue', status: 'MISMATCH', code: '₹4.2Cr vs ₹18.4Cr Claimed' },
  { name: 'Business PAN ID', tag: 'Active Company', status: 'VERIFIED', code: 'AABCU9603R' },
  { name: 'Company Registry', tag: 'Real Directors', status: 'VERIFIED', code: 'U72900DL2020PTC' },
  { name: 'Small Business Benefits', tag: 'MSME / Udyam', status: 'VERIFIED', code: 'UDYAM-DL-01-0082' },
  { name: 'Worker Staff Count', tag: 'Real Employee Count', status: 'FAKE COUNT', code: '14 Real vs 120 Claimed' },
  { name: 'Healthcare Insurance', tag: 'Worker Benefits', status: 'VERIFIED', code: '11000123450001001' },
  { name: 'Banned Sellers List', tag: 'Clean Record', status: 'CLEAN', code: 'Zero Blocks' },
  { name: 'DigiLocker Proofs', tag: 'Official Certificates', status: 'VERIFIED', code: 'Safe PDF' },
  { name: 'Make In India', tag: 'Indian Made %', status: 'VERIFIED', code: 'Class 1 (68.4%)' },
  { name: 'Startup India', tag: 'Startup Benefits', status: 'VERIFIED', code: 'DIPP89210' },
];

export default function PitchVideoStudioPage() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [overallTime, setOverallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMode, setVoiceMode] = useState('female'); // 'female' | 'male'
  
  const videoContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const totalDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);
  const currentScene = SCENES[currentSceneIdx];

  // Initialize studio audio player
  useEffect(() => {
    const audio = new Audio();
    audioPlayerRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sync mute state with audio player
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.muted = isMuted;
    }
    if (isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  // Scene transition sound effects removed for clean natural narration
  const playSoundEffect = () => {};

  const formatSpeechText = (text) => {
    if (!text) return '';
    return text
      // Fix 'AI' pronunciation so TTS speaks 'A. I.' (Ay-Eye) instead of 'eye' or 'ay'
      .replace(/\bAI\b/g, 'A. I.')
      .replace(/\bAi\b/g, 'A. I.')
      .replace(/\bA\.I\.\b/g, 'A. I.')
      .replace(/\bA\.I\b/g, 'A. I.')
      .replace(/₹/g, 'rupees ')
      .replace(/\bCr\b/gi, 'crore')
      .replace(/\bLakh\b/gi, 'lakh');
  };

  const speakCurrentScene = () => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const formattedText = formatSpeechText(currentScene.voiceover);
    const utterance = new SpeechSynthesisUtterance(formattedText);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('India') || v.name.includes('English (India)')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  const playSceneAudio = (scene) => {
    if (isMuted) return;

    const audioUrl = voiceMode === 'male' 
      ? `/audio/pitch_male/scene${scene.id}.mp3` 
      : `/audio/pitch/scene${scene.id}.mp3`;

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      playSceneAudio(currentScene);

      interval = setInterval(() => {
        setSceneProgress(prev => {
          const step = 100 / (currentScene.duration * 10);
          const next = prev + step;
          if (next >= 100) {
            // If studio audio is still playing, hold until it finishes
            if (voiceMode === 'studio' && audioPlayerRef.current && !audioPlayerRef.current.paused && !audioPlayerRef.current.ended && !isMuted) {
              return 100;
            }
            // If speech synthesis is speaking, hold
            if (voiceMode === 'browser' && 'speechSynthesis' in window && window.speechSynthesis.speaking && !isMuted) {
              return 100;
            }
            if (currentSceneIdx < SCENES.length - 1) {
              setCurrentSceneIdx(curr => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return next;
        });

        setOverallTime(prev => {
          if (prev >= totalDuration) return totalDuration;
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentSceneIdx, voiceMode]);

  const jumpToScene = (idx) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
    const timeBefore = SCENES.slice(0, idx).reduce((acc, s) => acc + s.duration, 0);
    setOverallTime(timeBefore);
  };

  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => alert(err.message));
    } else {
      document.exitFullscreen();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GeM_Audit_Pitch_Video_${Date.now()}.webm`;
        a.click();
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      jumpToScene(0);
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const currentElapsedInScene = (sceneProgress / 100) * currentScene.duration;
  const activeSubtitle = currentScene.subtitles.find(
    s => currentElapsedInScene >= s.start && currentElapsedInScene <= s.end
  ) || currentScene.subtitles[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 lg:p-8 font-sans">
      {/* Top Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                GeM Audit <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI PITCH STUDIO</span>
              </h1>
              <p className="text-xs text-slate-400">Cinematic 1080p Pitch Video Engine with Voiceover &amp; Live Registry Sandbox</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/gem-compliance-dashboard"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          {/* Voice Mode Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-slate-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={voiceMode}
              onChange={(e) => {
                const newMode = e.target.value;
                setVoiceMode(newMode);
                if (isPlaying) {
                  const audioUrl = newMode === 'male' 
                    ? `/audio/pitch_male/scene${currentScene.id}.mp3` 
                    : `/audio/pitch/scene${currentScene.id}.mp3`;
                  if (audioPlayerRef.current) {
                    audioPlayerRef.current.pause();
                    audioPlayerRef.current.src = audioUrl;
                    audioPlayerRef.current.currentTime = (sceneProgress / 100) * currentScene.duration;
                    audioPlayerRef.current.play().catch(() => {});
                  }
                }
              }}
              className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="female" className="bg-slate-900 text-emerald-300">🎙️ Natural Female (Neerja Expressive)</option>
              <option value="male" className="bg-slate-900 text-emerald-300">🎙️ Natural Male (Prabhat Executive)</option>
            </select>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              isMuted 
                ? 'bg-rose-950/40 border-rose-800/50 text-rose-400' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'Muted' : 'AI Voice Active'}
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 border border-emerald-500/40"
              title="Record and download the exact live animated video"
            >
              <Download className="w-4 h-4" />
              Record Exact Video (.webm)
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 animate-pulse"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              Stop &amp; Save Video
            </button>
          )}
        </div>
      </div>

      {/* Main 16:9 Cinema Container */}
      <div className="w-full max-w-6xl mt-6">
        <div 
          ref={videoContainerRef}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between select-none group"
        >
          {/* Top Video Overlay Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 lg:p-6 flex items-center justify-between bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentScene.tag}
              </span>
              <h2 className="text-sm lg:text-base font-bold text-white/90 drop-shadow">
                Scene {currentScene.id}: {currentScene.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                {Math.floor(overallTime)}s / {totalDuration}s
              </span>
              <button 
                onClick={toggleFullScreen}
                className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DYNAMIC SCENE CONTENT */}
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* SCENE 1: THE PAPERWORK PROBLEM */}
            {currentScene.id === 1 && (
              <div className="w-full h-full relative flex items-center justify-between p-8 lg:p-14 animate-fade-in bg-slate-950">
                <img 
                  src="/images/problem_officer.jpg" 
                  alt="Stressed Officer" 
                  className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 contrast-125 scale-105 transform transition-transform duration-10000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />

                <div className="relative z-20 max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> THE BIG PROBLEM
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                    Lakhs of Crores <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300">
                      Trapped in Slow Paperwork &amp; Fake Bids
                    </span>
                  </h1>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-rose-500/30 space-y-1">
                      <div className="text-rose-400 text-xs font-bold uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 5 to 7 Days Lost
                      </div>
                      <p className="text-xs text-slate-300">Officers spend days reading hundreds of PDF pages by hand.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-rose-500/30 space-y-1">
                      <div className="text-rose-400 text-xs font-bold uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Fake Documents
                      </div>
                      <p className="text-xs text-slate-300">Edited tax returns, fake sales numbers, and blacklisted companies.</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-20 hidden lg:flex flex-col items-center justify-center p-6 bg-rose-950/40 backdrop-blur-xl border border-rose-500/40 rounded-2xl text-center max-w-xs space-y-2 animate-bounce-slow">
                  <AlertTriangle className="w-10 h-10 text-rose-400" />
                  <div className="text-2xl font-black text-rose-200">Thousands of Crores</div>
                  <div className="text-xs font-medium text-rose-300/90 leading-relaxed">
                    Lost when public projects stall due to dishonest contractors.
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: MEET GEM AUDIT - FORENSIC BID DOCUMENT SCAN */}
            {currentScene.id === 2 && (
              <div className="w-full h-full relative flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12 animate-fade-in bg-slate-950 gap-6 overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Left: Explainer & Stats */}
                <div className="relative z-20 max-w-md space-y-3.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
                    <Sparkles className="w-3.5 h-3.5" /> BID DOCUMENT VERIFICATION
                  </div>

                  <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight">
                    Days of Manual Work.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                      Now Verified in 3 Seconds
                    </span>
                  </h1>

                  <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                    Earlier it took days of manual work checking papers. Now, GeM Audit reads the contractor's bid documents and verifies all information directly against official government portals in just 3 seconds.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-rose-300/80 font-medium">Earlier Process</div>
                        <div className="text-rose-200 font-bold text-xs">Days of Manual Work</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-[10px] text-emerald-300/80 font-medium">With GeM Audit</div>
                        <div className="text-emerald-200 font-bold text-xs">3-Second Portal Match</div>
                      </div>
                    </div>
                  </div>

                  {/* Micro Portal Check Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GST Tax Portal
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Income Tax PAN
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Company Registry (MCA)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> DigiLocker Proofs
                    </span>
                  </div>
                </div>

                {/* Right: Forensic Bid Document Verification UI Display */}
                <div className="relative z-20 flex-1 max-w-xl flex flex-col items-center">
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl shadow-cyan-500/20 group w-full">
                    {/* Top status bar on image */}
                    <div className="absolute top-0 left-0 right-0 z-30 px-3.5 py-2 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="font-mono font-bold text-cyan-300 text-[11px]">GOVTECH AI COMPARISON: BID vs GOVT DATABASE</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                        77% INFLATION CAUGHT
                      </span>
                    </div>

                    {/* Image Container with Relative Positioning for Exact Laser Overlay */}
                    <div className="relative w-full overflow-hidden pt-7 pb-1 flex items-center justify-center bg-slate-950">
                      {/* Forensic Visual Image */}
                      <img 
                        src="/images/gem_bid_document_verification.png" 
                        alt="GeM Audit Bid Document Forensic Verification"
                        className="w-full h-auto max-h-[370px] object-contain filter contrast-110 brightness-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/solution_officer.jpg";
                        }}
                      />

                      {/* Animated Scanning Blue Laser Overlay directly targeting the Submitted Bid Document */}
                      <div className="absolute left-[5.4%] top-[18%] w-[30.8%] h-[71%] pointer-events-none overflow-hidden rounded z-20">
                        {/* 1. Horizontal Moving Laser Beam */}
                        <div className="absolute left-0 right-0 h-1 bg-cyan-300 shadow-[0_0_15px_#22d3ee,0_0_30px_#06b6d4,0_0_45px_#38bdf8] animate-laser-sweep" />
                        
                        {/* 2. Trailing Laser Light Gradient */}
                        <div className="absolute left-0 right-0 h-14 bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent -translate-y-full animate-laser-sweep" />
                        
                        {/* 3. High-Energy Angled Laser Beam sweeping across document text */}
                        <div className="absolute -left-12 -right-12 h-2.5 bg-cyan-300/80 shadow-[0_0_20px_#22d3ee,0_0_40px_#06b6d4] animate-laser-angle blur-[0.5px]" />
                        <div className="absolute -left-12 -right-12 h-20 bg-gradient-to-b from-cyan-400/25 to-transparent animate-laser-angle -translate-y-10" />

                        {/* 4. Live OCR Scanning Status Badge */}
                        <div className="absolute bottom-2 left-2 right-2 px-1.5 py-1 rounded bg-slate-950/90 border border-cyan-500/40 flex items-center justify-between text-[9px] font-mono text-cyan-300 backdrop-blur-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> SCANNING...
                          </span>
                          <span className="text-rose-400 font-bold">MISMATCH</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Alert Banner synced to Step 2 */}
                    <div className="px-3.5 py-2 bg-slate-950/90 backdrop-blur-md border-t border-rose-500/40 flex items-center justify-between text-xs z-30">
                      <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>Discrepancy Caught: ₹18.4Cr Claimed vs ₹4.2Cr Central GST Portal</span>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        Forwarded to Step 2 →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: LIVE CLAIM CHECKER (STEP 2) */}
            {currentScene.id === 3 && (
              <div className="w-full h-full relative flex flex-col justify-center p-6 lg:p-12 animate-fade-in bg-slate-950">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
                      Live Claim Checker
                      <span className="text-xs font-normal text-rose-400 bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 rounded-full">
                        INSPECTING 2 FLAGGED CLAIMS
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Step 2: Deep check on the GST and Worker mismatches flagged in Step 1</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Bidder's Claim */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> What Bidder Claimed
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Submitted PDF</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px]">Claimed Annual Sales:</span>
                        <div className="text-base font-bold text-slate-200">₹18.40 Crore</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px]">Claimed Workers:</span>
                        <div className="text-base font-bold text-slate-200">120 Full-Time Staff</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Real Government Records */}
                  <div className="p-4 rounded-xl bg-rose-950/40 border-2 border-rose-500/60 space-y-3 shadow-lg shadow-rose-500/10 animate-pulse">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-800/40">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-rose-400" /> Real Government Records
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/30 text-rose-200">77% FAKE INFLATION</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-rose-300 text-[11px]">Actual Sales on Tax Portal:</span>
                        <div className="text-base font-black text-rose-400">₹4.20 Crore (CAUGHT)</div>
                      </div>
                      <div>
                        <span className="text-rose-300 text-[11px]">Actual Registered Workers:</span>
                        <div className="text-base font-black text-rose-400">14 Workers (CAUGHT)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Action Taken:</strong> Bidder disqualified for submitting false documents</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                    Auto-Written Rejection Letter Ready
                  </span>
                </div>
              </div>
            )}

            {/* SCENE 4: PERMANENT DIGITAL PROOF */}
            {currentScene.id === 4 && (
              <div className="w-full h-full relative flex flex-col justify-center items-center p-6 lg:p-12 animate-fade-in bg-slate-950 text-center space-y-4">
                <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 shadow-xl shadow-emerald-500/20">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>

                <div className="max-w-md space-y-2">
                  <h2 className="text-2xl lg:text-3xl font-black text-white">Permanent Digital Proof</h2>
                  <p className="text-xs lg:text-sm text-slate-400">
                    Every single check, score, and decision is locked with a digital seal that no one can tamper with or edit.
                  </p>
                </div>

                {/* Digital Security Seal Block */}
                <div className="w-full max-w-lg p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 font-mono text-xs text-left space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>DIGITAL SECURITY SEAL</span>
                    <span className="text-emerald-400 font-bold">● PERMANENT &amp; UNCHANGEABLE</span>
                  </div>
                  <div className="text-emerald-300 text-xs break-all">
                    SEAL-0x7f8a9e3b4d1c2a0f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                    <span>Status: Fully Protected</span>
                    <span>Ready for Legal &amp; Audit Inspection</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 5: THE 48-HOUR HELP BOT */}
            {currentScene.id === 5 && (
              <div className="w-full h-full relative flex items-center justify-between p-8 lg:p-14 animate-fade-in bg-slate-950">
                <div className="max-w-md space-y-3 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 animate-pulse" /> 48-HOUR DEADLINE RULE
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                    48-Hour Reply Helper<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-300">Beat The Clock, Save Your Bid</span>
                  </h2>

                  {/* 3-point Simple Explainer */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">● The Rule:</span>
                      <span>Buyers give sellers only 48 hours to answer questions.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">● The Danger:</span>
                      <span>Miss the 48 hours = <strong className="text-rose-300 font-semibold">Immediate bid rejection</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">● AI Helper:</span>
                      <span>Finds the right past papers &amp; writes the reply in 45 seconds.</span>
                    </div>
                  </div>

                  {/* Clarification Query Box */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Question from Buyer:
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                        48h Clock Ticking
                      </span>
                    </div>
                    <div className="font-medium text-slate-200 text-[11px]">
                      "Please submit proof of 3 past highway projects and manufacturer approval letter"
                    </div>
                  </div>
                </div>

                {/* Right: AI Instant Response Card */}
                <div className="hidden sm:flex flex-col max-w-xs w-full p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Found in 45 Seconds
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      On Time
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                      <span className="truncate mr-2 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-400" /> Highway-Project-Proof.pdf
                      </span>
                      <span className="text-emerald-400 font-bold text-[10px]">FOUND (98%)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                      <span className="truncate mr-2 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-400" /> Manufacturer-Letter.pdf
                      </span>
                      <span className="text-emerald-400 font-bold text-[10px]">VERIFIED</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center space-y-0.5 pt-1.5">
                    <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Reply Letter Written in 45 Seconds
                    </div>
                    <div className="text-[9px] text-emerald-400/80">Bid safely submitted before deadline expires</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 6: FAST, SIMPLE & HONEST BIDDING */}
            {currentScene.id === 6 && (
              <div className="w-full h-full relative flex flex-col justify-center items-center p-6 lg:p-12 animate-fade-in bg-slate-950 text-center space-y-5">
                <div className="space-y-1">
                  <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
                    Fast, Simple &amp; Honest Bidding
                  </h1>
                  <p className="text-xs lg:text-sm text-slate-400">Real, measurable speed and trust for government purchasing.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-2xl lg:text-3xl font-black text-emerald-400">96%</div>
                    <div className="text-xs font-bold text-slate-200">Faster Checking</div>
                    <div className="text-[11px] text-slate-400">7 Days → 8 Minutes</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-2xl lg:text-3xl font-black text-cyan-400">0%</div>
                    <div className="text-xs font-bold text-slate-200">Fake Papers</div>
                    <div className="text-[11px] text-slate-400">Direct Government Check</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-2xl lg:text-3xl font-black text-amber-400">100%</div>
                    <div className="text-xs font-bold text-slate-200">Permanent Proof</div>
                    <div className="text-[11px] text-slate-400">Digital Safety Seals</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  GeM Audit AI • Making Government Procurement Honest &amp; Fast
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC CINEMATIC SUBTITLE BAR */}
          <div 
            className={`absolute left-6 right-6 z-30 flex justify-center pointer-events-none transition-all duration-300 ${
              isPlaying ? 'bottom-5' : 'bottom-20'
            }`}
          >
            <div className="px-6 py-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-center max-w-3xl transform transition-all duration-300">
              <p className="text-xs sm:text-sm md:text-base font-bold text-amber-300 drop-shadow-md tracking-wide">
                "{activeSubtitle?.text || currentScene.voiceover.slice(0, 80)}..."
              </p>
            </div>
          </div>

          {/* BOTTOM VIDEO CONTROLS & TIMELINE (Auto-hides on Play, reveals on hover or pause) */}
          <div 
            className={`absolute bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent border-t border-slate-800/80 flex flex-col gap-2 transition-all duration-300 ${
              isPlaying 
                ? 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto' 
                : 'opacity-100 translate-y-0 pointer-events-auto'
            }`}
          >
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              {SCENES.map((scene, idx) => {
                let fill = 0;
                if (idx < currentSceneIdx) fill = 100;
                else if (idx === currentSceneIdx) fill = sceneProgress;
                return (
                  <div 
                    key={scene.id} 
                    style={{ width: `${(scene.duration / totalDuration) * 100}%` }}
                    className="h-full border-r border-slate-950 relative"
                  >
                    <div 
                      style={{ width: `${fill}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-100"
                    />
                  </div>
                );
              })}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => jumpToScene(0)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Replay from Beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scene Jump Pills */}
              <div className="hidden md:flex items-center gap-1.5">
                {SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => jumpToScene(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      idx === currentSceneIdx
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Scene {scene.id}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Scene {currentSceneIdx + 1} / {SCENES.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storyboard Script Quick Sheet */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENES.map((s, idx) => (
          <div 
            key={s.id}
            onClick={() => jumpToScene(idx)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              idx === currentSceneIdx 
                ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30' 
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400">SCENE {s.id} ({s.duration}s)</span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">{s.tag}</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">{s.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{s.voiceover}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
