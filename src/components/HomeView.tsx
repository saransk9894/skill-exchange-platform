import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Layers, 
  Award, 
  RefreshCw, 
  CheckCircle,
  TrendingUp,
  Brain,
  MessageSquare,
  Sparkles,
  Search,
  Globe,
  MapPin,
  Flame
} from 'lucide-react';
import { Skill, User } from '../types';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  skills: Skill[];
  users: User[];
  onSearchCategory: (category: string) => void;
  darkMode: boolean;
}

export default function HomeView({ setActiveTab, skills, users, onSearchCategory, darkMode }: HomeViewProps) {
  const stats = [
    { label: 'Active Learners', value: users.filter(u => u.role !== 'admin').length + 42, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Skills Shared', value: skills.length + 18, icon: Layers, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Knowledge Swaps Completed', value: 87, icon: RefreshCw, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Certified Completions', value: 34, icon: Award, color: 'text-amber-500 bg-amber-500/10' }
  ];

  const corePillars = [
    {
      title: 'Teach What You Master',
      desc: 'Whether you are a professional programmer, a passionate guitar player, or a native Spanish speaker, your knowledge has immense value.',
      icon: Brain,
      color: 'bg-blue-600'
    },
    {
      title: 'Learn What You Need',
      desc: 'Request lessons and practice directly with real peers. Expand your toolkit completely free—the only currency is mutual exchange.',
      icon: Sparkles,
      color: 'bg-indigo-600'
    },
    {
      title: 'Coordinate & Certificate',
      desc: 'Coordinate directly through private secure chats, book structured sessions with online meeting links, and earn downloadable completion certificates.',
      icon: CheckCircle,
      color: 'bg-emerald-600'
    }
  ];

  const categories = [
    { name: 'Technology & Coding', icon: Globe, count: skills.filter(s => s.category === 'Technology & Coding').length },
    { name: 'Languages', icon: MessageSquare, count: skills.filter(s => s.category === 'Languages').length },
    { name: 'Music & Arts', icon: Award, count: skills.filter(s => s.category === 'Music & Arts').length },
    { name: 'Health & Fitness', icon: Flame, count: skills.filter(s => s.category === 'Health & Fitness').length },
    { name: 'Academics & Writing', icon: Brain, count: skills.filter(s => s.category === 'Academics & Writing').length }
  ];

  return (
    <div className="space-y-16 py-6" id="home-view-container">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl p-8 sm:p-12 lg:p-16 border border-slate-800/80">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-400/20 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md text-indigo-300">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Pure Barter Education — No Money Required</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Unlock the power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Collaborative</span> learning.
          </h1>
          
          <p className="text-base text-slate-300 max-w-xl font-normal leading-relaxed">
            The Skill Exchange System allows you to barter your expertise. Teach Web Development to learn Acoustic Guitar, or share cooking recipes to learn Conversational Spanish.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-4">
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-6 py-3.5 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 active:scale-95 transition-all flex items-center space-x-2"
              id="cta-explore"
            >
              <span>Explore Active Skills</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-800 hover:bg-slate-800 transition-all active:scale-95"
              id="cta-register"
            >
              Open My Dashboard
            </button>
          </div>
        </div>

        {/* Backdrop visual elements */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden lg:block transform translate-x-12 translate-y-12">
          <Brain className="h-96 w-96 text-white" />
        </div>
      </section>

      {/* Metrics Counter Dashboard */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-xs ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className={`text-2xl font-bold tracking-tight block ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Core Concept Columns */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className={`text-3xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            How SkillBarter Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A secure peer-to-peer ecosystem built to bypass financial barriers and promote true knowledge distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {corePillars.map((pillar, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-xs hover:-translate-y-1 text-left ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/60 shadow-2xs'
              }`}
            >
              <div className={`${pillar.color} text-white p-2.5 rounded-xl w-fit shadow-xs`}>
                <pillar.icon className="h-4.5 w-4.5" />
              </div>
              <h3 className={`text-base font-bold mt-6 mb-3 ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter by Categories */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1 text-left">
            <h2 className={`text-2xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
                }`}>
              Browse by Category
            </h2>
            <p className="text-xs text-slate-400">
              Jump straight into specialized domains of learning.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('catalog')} 
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
          >
            <span>See All Catalog Items</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => {
                onSearchCategory(cat.name);
                setActiveTab('catalog');
              }}
              className={`p-5 rounded-2xl border text-center cursor-pointer transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xs ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/50 shadow-2xs'
              } group`}
            >
              <div className="mx-auto bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform duration-200 border border-slate-200/30 dark:border-slate-700/30">
                <cat.icon className="h-4.5 w-4.5" />
              </div>
              <p className={`text-xs font-bold mt-4 block truncate ${
                darkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {cat.name}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">
                {cat.count} listings
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials or Quotes */}
      <section className={`p-8 sm:p-10 rounded-3xl border text-left ${
        darkMode ? 'bg-[#111827] border-slate-850' : 'bg-slate-50/50 border-slate-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/3 text-left">
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Featured Exchange
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Alice and Roberto connected last week to trade computer science for languages.
            </p>
            <div className="flex -space-x-2 mt-4">
              <img className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="" />
              <img className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="" />
            </div>
          </div>
          <div className="lg:w-2/3 border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-slate-800/80 pt-6 lg:pt-0 lg:pl-8">
            <blockquote className="text-sm italic text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
              "As a developer, I wanted to learn conversational Spanish for an upcoming trip. Roberto was an incredible teacher, and in exchange, I was able to help him learn the basics of React and CSS. This barter system is the future of democratized education!"
            </blockquote>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-4">— Alice Smith (Software Engineer)</p>
          </div>
        </div>
      </section>

    </div>
  );
}
