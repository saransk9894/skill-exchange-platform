import React, { useState } from 'react';
import { Skill, User } from '../types';
import { 
  Search, 
  MapPin, 
  Filter, 
  PlusCircle, 
  ArrowRightLeft, 
  User as UserIcon, 
  X, 
  Sparkles, 
  BookOpen, 
  BookMarked,
  Check
} from 'lucide-react';

interface SkillCatalogViewProps {
  skills: Skill[];
  currentUser: User;
  onAddSkill: (skillData: { name: string; category: string; description: string; level: string }) => void;
  onSendRequest: (requestData: {
    receiverId: string;
    skillOfferedId: string;
    skillOfferedName: string;
    skillWantedId: string;
    skillWantedName: string;
  }) => void;
  categories: string[];
  searchCategory: string;
  onSearchCategory: (cat: string) => void;
  darkMode: boolean;
}

export default function SkillCatalogView({
  skills,
  currentUser,
  onAddSkill,
  onSendRequest,
  categories,
  searchCategory,
  onSearchCategory,
  darkMode
}: SkillCatalogViewProps) {
  // Query filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Add Skill Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Technology & Coding');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // Exchange Proposal Modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedTargetSkill, setSelectedTargetSkill] = useState<Skill | null>(null);
  const [chosenOfferedSkillName, setChosenOfferedSkillName] = useState('');

  // Submit Skill addition
  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !skillDescription.trim()) return;

    onAddSkill({
      name: skillName.trim(),
      category: skillCategory,
      description: skillDescription.trim(),
      level: skillLevel
    });

    // Reset fields
    setSkillName('');
    setSkillDescription('');
    setShowAddModal(false);
  };

  // Submit Exchange proposal
  const handleExchangeSubmit = () => {
    if (!selectedTargetSkill || !chosenOfferedSkillName) return;

    // We search our listed skills Offered to find the ID, or just map the text
    onSendRequest({
      receiverId: selectedTargetSkill.userId,
      skillOfferedId: 's_custom_offered',
      skillOfferedName: chosenOfferedSkillName,
      skillWantedId: selectedTargetSkill.id,
      skillWantedName: selectedTargetSkill.name
    });

    setShowExchangeModal(false);
    setSelectedTargetSkill(null);
  };

  // Run frontend filters over the items
  const filteredSkills = skills.filter(skill => {
    // Exclude skills owned by current logged in user (can't trade with yourself)
    if (skill.userId === currentUser.id) return false;

    const matchesQuery = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = searchCategory === 'All' || skill.category === searchCategory;

    // Check location of user
    const matchesLocation = !searchLocation.trim() || (skill.userName && skill.userName.toLowerCase().includes(searchLocation.toLowerCase())); 

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8 py-6" id="skill-catalog-container">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Explore Knowledge Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search peer listings, filter by categories, and request knowledge exchanges.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 active:scale-95 transition flex items-center space-x-2"
          id="btn-add-skill"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Share a New Skill</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills, topics, teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-hidden ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50/50 border-slate-200/80 text-slate-800 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Category Filter selector */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <select
              value={searchCategory}
              onChange={(e) => onSearchCategory(e.target.value)}
              className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-hidden appearance-none ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50/50 border-slate-200/80 text-slate-800 focus:border-blue-500'
              }`}
            >
              <option value="All">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location search placeholder */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by teacher name or location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-hidden ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50/50 border-slate-200/80 text-slate-800 focus:border-blue-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredSkills.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center text-slate-400 max-w-xl mx-auto space-y-4">
          <BookMarked className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-md font-bold text-slate-500">No Swaps Found</h3>
          <p className="text-xs text-slate-400 leading-normal">
            We couldn't find matching skills shared by other members with your filter settings. Try relaxing search strings or share your own skill!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skills-grid">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${
                darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/60 shadow-2xs'
              }`}
            >
              {/* Top Row Category & Badge */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg dark:bg-blue-950/40 dark:text-blue-300 font-bold uppercase tracking-wider border border-blue-100/30">
                    {skill.category}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-150 dark:bg-slate-800 dark:text-slate-300 text-slate-600 rounded-md font-bold">
                    {skill.level}
                  </span>
                </div>

                <h3 className={`text-sm font-bold tracking-tight text-left ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {skill.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed text-left">
                  {skill.description}
                </p>
              </div>

              {/* Bottom Row Profile & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-slate-200/80"
                    src={skill.userAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(skill.userName)}`}
                    alt={skill.userName}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left min-w-0">
                    <span className={`text-xs font-bold block truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {skill.userName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Peer Teacher
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTargetSkill(skill);
                    setChosenOfferedSkillName(currentUser.skillsOffered[0] || '');
                    setShowExchangeModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs active:scale-95 transition shrink-0"
                >
                  Propose Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHARE NEW SKILL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl border shadow-2xl max-w-md w-full overflow-hidden ${
            darkMode ? 'bg-slate-950 border-slate-900 text-white' : 'bg-white border-slate-200/80 text-slate-800'
          }`}>
            <div className="flex justify-between items-center p-4.5 border-b border-slate-200/60 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-bold text-sm">Share a New Skill</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="p-6 space-y-4.5 text-xs text-left">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Skill / Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intermediate Python, Spanish Speaking, Yoga Coaching"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Category</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <option value="Technology & Coding">Technology & Coding</option>
                  <option value="Languages">Languages</option>
                  <option value="Music & Arts">Music & Arts</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Academics & Writing">Academics & Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Your Expertise Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <option value="Beginner">Beginner (Curated/Structured)</option>
                  <option value="Intermediate">Intermediate (Conversational/Practical)</option>
                  <option value="Expert">Expert (Advanced/Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Brief Course / Skill Description</label>
                <textarea
                  required
                  placeholder="Explain what peers will learn and your teaching structure..."
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4.5 border-t border-slate-200/60 dark:border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Share Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROPOSE BARTER EXCHANGE REQUEST MODAL */}
      {showExchangeModal && selectedTargetSkill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl border shadow-2xl max-w-md w-full overflow-hidden ${
            darkMode ? 'bg-slate-950 border-slate-900 text-white' : 'bg-white border-slate-200/80 text-slate-800'
          }`}>
            <div className="flex justify-between items-center p-4.5 border-b border-slate-200/60 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                <span>Configure Knowledge Barter</span>
              </h3>
              <button onClick={() => setShowExchangeModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-left">
              
              {/* Informative connection map */}
              <div className="flex justify-between items-center bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                <div className="text-center w-1/3 space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">LEARNING</span>
                  <span className="font-bold text-blue-600 truncate block">{selectedTargetSkill.name}</span>
                </div>
                <div className="w-1/3 flex justify-center text-slate-400">
                  <ArrowRightLeft className="h-4 w-4 animate-pulse" />
                </div>
                <div className="text-center w-1/3 space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">TEACHING</span>
                  <span className="font-bold text-indigo-600 truncate block">{chosenOfferedSkillName || 'Any Listed Skill'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  You are proposing a knowledge barter with <strong className="text-slate-800 dark:text-white">{selectedTargetSkill.userName}</strong>. They will teach you <strong className="text-blue-500">"{selectedTargetSkill.name}"</strong>. Select which of your skills you'd like to teach them in return:
                </p>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Choose From Your Offered List</label>
                  {currentUser.skillsOffered.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
                      You haven't listed any Offered Skills on your profile. Write a skill below to auto-add it to your profile list:
                      <input
                        type="text"
                        required
                        placeholder="e.g. Coding Basics"
                        value={chosenOfferedSkillName}
                        onChange={(e) => setChosenOfferedSkillName(e.target.value)}
                        className={`w-full p-2.5 mt-2 rounded-lg border focus:outline-hidden ${
                          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                  ) : (
                    <select
                      value={chosenOfferedSkillName}
                      onChange={(e) => setChosenOfferedSkillName(e.target.value)}
                      className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {currentUser.skillsOffered.map((skill, index) => (
                        <option key={index} value={skill}>{skill}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4.5 border-t border-slate-200/60 dark:border-slate-900">
                <button
                  onClick={() => setShowExchangeModal(false)}
                  className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExchangeSubmit}
                  disabled={!chosenOfferedSkillName}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
                >
                  Propose Swap Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
