import React, { useState, useEffect } from 'react';
import { 
  User, 
  ExchangeRequest, 
  Notification, 
  SessionBooking, 
  ExperienceLevel 
} from '../types';
import { 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Check, 
  X, 
  Sparkles, 
  Award, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  ArrowRightLeft, 
  Clock,
  Printer
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  requests: ExchangeRequest[];
  onUpdateRequestStatus: (requestId: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
  sessions: SessionBooking[];
  darkMode: boolean;
}

export default function DashboardView({
  currentUser,
  onUpdateProfile,
  requests,
  onUpdateRequestStatus,
  sessions,
  darkMode
}: DashboardViewProps) {
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(currentUser.experienceLevel);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [offeredSkills, setOfferedSkills] = useState<string[]>(currentUser.skillsOffered);
  const [wantedSkills, setWantedSkills] = useState<string[]>(currentUser.skillsWanted);

  // AI Recommendation state
  const [aiRecs, setAiRecs] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Active certificate modal state
  const [selectedCertificate, setSelectedCertificate] = useState<SessionBooking | null>(null);

  useEffect(() => {
    setName(currentUser.name);
    setPhone(currentUser.phone);
    setBio(currentUser.bio);
    setLocation(currentUser.location);
    setExperienceLevel(currentUser.experienceLevel);
    setOfferedSkills(currentUser.skillsOffered);
    setWantedSkills(currentUser.skillsWanted);
  }, [currentUser]);

  // Handle Fetch AI Matchmaking
  const fetchAiRecommendations = async () => {
    setLoadingAi(true);
    setAiError('');
    try {
      const res = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (!res.ok) throw new Error('Failed to load neural recommendations');
      const data = await res.json();
      setAiRecs(data);
    } catch (err: any) {
      setAiError(err.message || 'Error executing matching queries');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      phone,
      bio,
      location,
      experienceLevel,
      skillsOffered: offeredSkills,
      skillsWanted: wantedSkills
    });
    setIsEditing(false);
  };

  const addOfferedSkill = () => {
    if (newOfferedSkill.trim() && !offeredSkills.includes(newOfferedSkill.trim())) {
      setOfferedSkills([...offeredSkills, newOfferedSkill.trim()]);
      setNewOfferedSkill('');
    }
  };

  const removeOfferedSkill = (index: number) => {
    setOfferedSkills(offeredSkills.filter((_, i) => i !== index));
  };

  const addWantedSkill = () => {
    if (newWantedSkill.trim() && !wantedSkills.includes(newWantedSkill.trim())) {
      setWantedSkills([...wantedSkills, newWantedSkill.trim()]);
      setNewWantedSkill('');
    }
  };

  const removeWantedSkill = (index: number) => {
    setWantedSkills(wantedSkills.filter((_, i) => i !== index));
  };

  const receivedRequests = requests.filter(r => r.receiverId === currentUser.id);
  const sentRequests = requests.filter(r => r.senderId === currentUser.id);

  const completedSessions = sessions.filter(s => s.completed && s.hasCertificate);

  return (
    <div className="space-y-12 py-6" id="dashboard-view-container">
      
      {/* Upper Grid (Profile Card & Quick Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Management */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 relative ${
          darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <h2 className={`text-md font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              My Barter Profile
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold hover:underline"
                id="edit-profile-btn"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Modify Profile</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4.5 text-xs text-left" id="profile-edit-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Bio (Introduction)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              {/* Skills Offered Manager */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">My Offered Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Photoshop, Spanish, Python"
                    value={newOfferedSkill}
                    onChange={(e) => setNewOfferedSkill(e.target.value)}
                    className={`flex-1 p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    onClick={addOfferedSkill}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {offeredSkills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 inline-flex items-center gap-1 border border-blue-100/30">
                      {skill}
                      <button onClick={() => removeOfferedSkill(index)} className="hover:text-red-500 cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Wanted Manager */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Skills I Want to Learn</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. French, Cooking, React"
                    value={newWantedSkill}
                    onChange={(e) => setNewWantedSkill(e.target.value)}
                    className={`flex-1 p-3 rounded-xl border focus:outline-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    onClick={addWantedSkill}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {wantedSkills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 inline-flex items-center gap-1 border border-indigo-100/30">
                      {skill}
                      <button onClick={() => removeWantedSkill(index)} className="hover:text-red-500 cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4.5 border-t border-slate-100 dark:border-slate-900">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6" id="profile-display">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <img
                  className="h-20 w-20 rounded-full object-cover border border-slate-200/80 shadow-xs"
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-2.5 text-left">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                    <h3 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {currentUser.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200/20 dark:border-slate-800">
                      Level: {currentUser.experienceLevel}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    {currentUser.bio || "No profile bio has been written yet."}
                  </p>
                </div>
              </div>

              {/* Attributes block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                <div className="flex items-center space-x-2 text-xs">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{currentUser.location || "Earth"}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{currentUser.phone || "Not Shared"}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{currentUser.email}</span>
                </div>
              </div>

              {/* Skills Tags block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-900 text-xs">
                <div className="text-left">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[10px]">My Offered Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.skillsOffered.length === 0 ? (
                      <span className="text-slate-400 italic">None listed.</span>
                    ) : (
                      currentUser.skillsOffered.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100/30">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[10px]">My Desired Knowledge</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.skillsWanted.length === 0 ? (
                      <span className="text-slate-400 italic">None listed.</span>
                    ) : (
                      currentUser.skillsWanted.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100/30">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Earned Center */}
        <div className={`p-6 rounded-2xl border text-left ${
          darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
        }`}>
          <div className="flex items-center space-x-2.5 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Barter Credentials
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Earn downloadable and verification-friendly completion credentials upon successfully completing a booking session swap!
          </p>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {completedSessions.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                No completion certificates generated yet. Wrap up structured lessons under "Sessions & Bookings" to earn credentials!
              </div>
            ) : (
              completedSessions.map(session => (
                <div 
                  key={session.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition cursor-pointer hover:border-amber-400 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}
                  onClick={() => setSelectedCertificate(session)}
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold truncate text-slate-800 dark:text-white">Certificate: #{session.id.substring(2, 6).toUpperCase()}</p>
                    <p className="text-[10px] text-slate-400">{session.date}</p>
                  </div>
                  <button className="px-2.5 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-500/20 text-[10px] font-bold transition shrink-0 cursor-pointer">
                    View Cert
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Gemini AI Matchmaking Center */}
      <section className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden text-left ${
        darkMode ? 'bg-slate-950 border-slate-900' : 'bg-linear-to-br from-blue-50/20 to-indigo-50/10 border-blue-100/60 shadow-2xs'
      }`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="h-48 w-48 text-indigo-500" />
        </div>

        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-bold dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/10">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>AI Matchmaker Recommendation Engine</span>
          </div>
          <h3 className={`text-lg font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Smart Skill Exchange Matchmaking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Let our built-in Gemini Matchmaker run heuristics and evaluate current available peer catalogs against your Offered and Wanted listings. Discover highly relevant partner barter pairings instantly.
          </p>

          <button
            onClick={fetchAiRecommendations}
            disabled={loadingAi}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition flex items-center space-x-2"
          >
            <span>{loadingAi ? 'AI Matchmaker Thinking...' : 'Search Neural Matches'}</span>
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* AI Recommendations Output */}
        {aiError && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 text-red-600 text-xs font-semibold border border-red-500/10">
            {aiError}
          </div>
        )}

        {aiRecs && (
          <div className="mt-8 space-y-6 pt-6 border-t border-dashed border-slate-200 dark:border-slate-900">
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic border-l-2 border-indigo-500 pl-4">
              " {aiRecs.explanation} "
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecs.recommendations?.map((rec: any, idx: number) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/50 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">MATCH #{idx+1}</span>
                      <span className="font-bold text-slate-400 uppercase tracking-wider">Teacher: {rec.teacherName}</span>
                    </div>
                    <h4 className={`text-sm font-bold tracking-tight text-left ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Learn "{rec.skillName}"
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
                      {rec.reasoning}
                    </p>
                  </div>
                  <div className="mt-4 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-slate-400">Offer In Exchange:</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{rec.offeredSkillMatch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Exchange Requests Manager */}
      <section className="space-y-8">
        <div className="border-b border-slate-100 dark:border-slate-900 pb-3 text-left">
          <h2 className={`text-md font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Skill Exchange Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Accept pending barter offers or monitor status updates of requests you've sent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Received Requests */}
          <div className="space-y-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider text-left flex items-center space-x-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Requests Received ({receivedRequests.length})</span>
            </h3>

            {receivedRequests.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                You haven't received any active barter requests yet. Check out "Explore Skills" and add more Offered expertise to attract partners!
              </div>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map(req => (
                  <div 
                    key={req.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 hover:shadow-2xs transition ${
                      darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{req.senderName}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          req.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100/30' :
                          req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100/30' : 'bg-slate-50 text-slate-600 dark:bg-slate-900'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Wants to learn your: <strong className="text-blue-600 dark:text-blue-400 font-semibold">"{req.skillWantedName}"</strong>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Offers in exchange: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">"{req.skillOfferedName}"</strong>
                      </p>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'accepted')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Exchange</span>
                        </button>
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'rejected')}
                          className="px-3 py-2 border border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs text-slate-400 flex items-center justify-center transition"
                          title="Reject Request"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div className="space-y-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider text-left flex items-center space-x-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Requests Sent ({sentRequests.length})</span>
            </h3>

            {sentRequests.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                You haven't dispatched any barter request yet. Browse the Skills catalogue and invite peers to collaborate!
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map(req => (
                  <div 
                    key={req.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 hover:shadow-2xs transition ${
                      darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">To: {req.receiverName}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          req.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100/30' :
                          req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100/30' : 'bg-slate-50 text-slate-600 dark:bg-slate-900'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Offered: <strong className="text-blue-600 dark:text-blue-400 font-semibold">"{req.skillOfferedName}"</strong>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Requested: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">"{req.skillWantedName}"</strong>
                      </p>
                    </div>

                    {req.status === 'pending' && (
                      <button
                        onClick={() => onUpdateRequestStatus(req.id, 'cancelled')}
                        className="w-full py-2 border border-dashed border-slate-200 hover:text-red-500 hover:border-red-500 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Request</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Completion Certificate Modal Rendering */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full relative shadow-2xl p-1 text-white">
            
            {/* Action buttons bar */}
            <div className="flex justify-between items-center p-4 bg-slate-950 rounded-t-xl border-b border-slate-900">
              <span className="text-xs font-bold font-mono text-amber-500">Official Barter Credential</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => window.print()}
                  className="p-1.5 bg-slate-900 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                  title="Print Certificate"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Template Canvas */}
            <div className="p-8 sm:p-12 text-center bg-slate-950 border-4 border-double border-amber-600/30 rounded-b-xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none">
                <Award className="h-64 w-64 text-amber-500" />
              </div>

              {/* Logo / seal */}
              <div className="mx-auto bg-amber-500/10 text-amber-500 p-4 rounded-full w-fit">
                <Award className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif text-amber-400 font-bold uppercase tracking-widest">
                  Certificate of Barter Completion
                </h2>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Skill Exchange System Platform Credential
                </p>
              </div>

              <p className="text-sm font-normal text-slate-300">
                This certifies that a direct educational exchange has been successfully coordinated and completed.
              </p>

              {/* Recipient Details */}
              <div className="border-t border-b border-slate-900 py-6 max-w-md mx-auto space-y-1">
                <p className="text-xs text-slate-400">Awarded to Partner Peers</p>
                <p className="text-lg font-bold font-serif text-white uppercase">{currentUser.name}</p>
                <p className="text-xs text-slate-400 mt-1">For sharing & swapping skills in peer-to-peer lessons</p>
              </div>

              {/* Booking reference info */}
              <div className="grid grid-cols-2 max-w-sm mx-auto text-center gap-4 text-xs font-mono text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500">SESSION DATE</span>
                  <span>{selectedCertificate.date}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">CREDENTIAL ID</span>
                  <span>SKILL-SWAP-{selectedCertificate.id.substring(2, 6).toUpperCase()}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center text-[10px] text-slate-500">
                <span>✓ Digitally Verified Peer-Barter Exchange System</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
