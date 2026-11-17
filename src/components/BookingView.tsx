import React, { useState } from 'react';
import { SessionBooking, ExchangeRequest, User } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  PlusCircle, 
  Check, 
  X, 
  Star, 
  AlertCircle, 
  Award,
  ExternalLink
} from 'lucide-react';

interface BookingViewProps {
  currentUser: User;
  sessions: SessionBooking[];
  requests: ExchangeRequest[];
  onAddSession: (sessionData: {
    requestId: string;
    date: string;
    time: string;
    type: 'online' | 'offline';
    locationDetails: string;
    notes: string;
  }) => void;
  onUpdateSessionStatus: (sessionId: string, completed: boolean) => void;
  onSubmitReview: (reviewData: {
    bookingId: string;
    rating: number;
    comment: string;
    revieweeId: string;
  }) => void;
  darkMode: boolean;
}

export default function BookingView({
  currentUser,
  sessions,
  requests,
  onAddSession,
  onUpdateSessionStatus,
  onSubmitReview,
  darkMode
}: BookingViewProps) {
  // Add Session State
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'online' | 'offline'>('online');
  const [locationDetails, setLocationDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<SessionBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Accepted requests list to select from
  const acceptedRequests = requests.filter(
    r => r.status === 'accepted' && (r.senderId === currentUser.id || r.receiverId === currentUser.id)
  );

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId || !date || !time) return;

    onAddSession({
      requestId: selectedRequestId,
      date,
      time,
      type,
      locationDetails: locationDetails.trim() || (type === 'online' ? 'https://meet.google.com/abc-mock-swap' : 'Main Library Room 4B'),
      notes: notes.trim()
    });

    // Reset
    setSelectedRequestId('');
    setDate('');
    setTime('');
    setNotes('');
    setLocationDetails('');
    setShowAddForm(false);
  };

  const handleOpenReviewModal = (session: SessionBooking) => {
    setSelectedSessionForReview(session);
    setRating(5);
    setComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReviewForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForReview) return;

    // Find reviewee
    const request = requests.find(r => r.id === selectedSessionForReview.requestId);
    if (!request) return;

    const revieweeId = request.senderId === currentUser.id ? request.receiverId : request.senderId;

    onSubmitReview({
      bookingId: selectedSessionForReview.id,
      rating,
      comment: comment.trim(),
      revieweeId
    });

    setShowReviewModal(false);
    setSelectedSessionForReview(null);
  };

  return (
    <div className="space-y-8 py-6" id="bookings-view-container">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Structured Sessions & Bookings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Book online/offline lessons with accepted peers and generate credentials.
          </p>
        </div>
        
        {acceptedRequests.length > 0 && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 active:scale-95 transition flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Schedule New Swap Lesson</span>
          </button>
        )}
      </div>

      {/* Schedule Form */}
      {showAddForm && (
        <div className={`p-6 rounded-2xl border text-left ${
          darkMode ? 'bg-slate-950 border-slate-900 text-white' : 'bg-white border-slate-200/60 shadow-2xs'
        }`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Book Lessons Slot</h3>
          <form onSubmit={handleSubmitSession} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Select Approved Exchange Partner</label>
                <select
                  required
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="">-- Choose Partner --</option>
                  {acceptedRequests.map(req => {
                    const otherPartyName = req.senderId === currentUser.id ? req.receiverName : req.senderName;
                    return (
                      <option key={req.id} value={req.id}>
                        {otherPartyName} (Swap: {req.skillOfferedName} ⇄ {req.skillWantedName})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Session Mode</label>
                <div className="flex gap-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 w-fit border border-slate-200/30 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => { setType('online'); setLocationDetails('https://meet.google.com/abc-mock-swap'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      type === 'online' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Online Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('offline'); setLocationDetails('Central Library, Study Room 3'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      type === 'offline' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Offline Place</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Pick Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Pick Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Meeting Coordinates or Address</label>
              <input
                type="text"
                placeholder={type === 'online' ? 'https://meet.google.com/...' : 'e.g. Starbucks Main Street, Room 10'}
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Lesson Notes / Agenda</label>
              <textarea
                placeholder="What topics will you cover in this lesson?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50/50 border-slate-200'
                }`}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4.5 border-t border-slate-200/65 dark:border-slate-900">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Lesson Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session Logs listing */}
      <div className="space-y-4">
        <h3 className={`text-xs font-bold uppercase tracking-wider text-left ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Lessons History & Scheduled Calendar
        </h3>

        {sessions.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center text-slate-400 max-w-md mx-auto space-y-4">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-500 text-xs">No Scheduled Swaps Yet</h3>
            <p className="text-xs text-slate-400 leading-normal">
              You must accept a Skill Exchange proposal first. Once accepted, use the Booking button to schedule a lesson here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bookings-grid">
            {sessions.map(session => {
              const req = requests.find(r => r.id === session.requestId);
              if (!req) return null;
              
              const isSender = req.senderId === currentUser.id;
              const partnerName = isSender ? req.receiverName : req.senderName;
              
              const myRoleText = isSender ? 'Learning' : 'Teaching';
              const lessonSkill = isSender ? req.skillWantedName : req.skillOfferedName;

              return (
                <div 
                  key={session.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 hover:shadow-xs transition duration-200 ${
                    darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
                  }`}
                >
                  <div className="space-y-4 text-xs">
                    
                    {/* Status header */}
                    <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-900">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                          {session.date} at {session.time}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider text-[9px] ${
                        session.status === 'scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100/30' :
                        session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100/30' : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-100/30'
                      }`}>
                        {session.status}
                      </span>
                    </div>

                    {/* Lesson Core description */}
                    <div className="space-y-1.5 text-left">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">BARTER LESSON</p>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {myRoleText}: <span className="text-blue-600 dark:text-blue-400 font-extrabold">"{lessonSkill}"</span>
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400">
                        Peer Partner: <strong className="font-bold text-slate-700 dark:text-white">{partnerName}</strong>
                      </p>
                      {session.notes && (
                        <p className="italic text-slate-400 text-[10px] mt-1">
                          "{session.notes}"
                        </p>
                      )}
                    </div>

                    {/* Coordinates / meeting links */}
                    <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      {session.type === 'online' ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-blue-500" />
                          <a 
                            href={session.locationDetails} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5 truncate"
                          >
                            <span>Google Meet Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="text-slate-600 dark:text-slate-300 truncate">
                            {session.locationDetails}
                          </span>
                        </>
                      )}
                    </div>

                  </div>

                  {/* Actions buttons */}
                  {session.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateSessionStatus(session.id, true)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Complete Exchange Lesson</span>
                      </button>
                    </div>
                  )}

                  {session.status === 'completed' && !session.hasCertificate && (
                    <div className="p-3 bg-blue-500/5 rounded-xl border border-dashed border-blue-500/10 flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[10px] font-medium">Rate and leave a review:</span>
                      <button
                        onClick={() => handleOpenReviewModal(session)}
                        className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-[10px] rounded-lg shadow-2xs hover:bg-blue-700 transition"
                      >
                        Write Review
                      </button>
                    </div>
                  )}

                  {session.status === 'completed' && session.hasCertificate && (
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1 justify-center">
                      <span>✓ Swapped & review finalized. Credential available under Dashboard.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RATING & REVIEW DIALOG MODAL */}
      {showReviewModal && selectedSessionForReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-3xl border shadow-2xl max-w-md w-full overflow-hidden ${
            darkMode ? 'bg-slate-950 border-slate-900 text-white' : 'bg-white border-slate-200/85 text-slate-800'
          }`}>
            <div className="flex justify-between items-center p-4.5 border-b border-slate-200/60 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-bold text-sm">Review Peer Partner</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReviewForm} className="p-6 space-y-4.5 text-xs text-left">
              
              {/* Star selector */}
              <div>
                <label className="block text-slate-400 font-bold mb-2 uppercase tracking-wider text-[10px]">Rate Partnership (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 text-yellow-400 hover:scale-110 transition cursor-pointer"
                    >
                      <Star 
                        className="h-6 w-6" 
                        fill={starVal <= rating ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Write Review Message</label>
                <textarea
                  required
                  placeholder="Share details of what went well in this lesson, their instruction patience, etc..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4.5 border-t border-slate-200/60 dark:border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
