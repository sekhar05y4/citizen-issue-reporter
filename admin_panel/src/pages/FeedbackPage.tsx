import React, { useEffect, useState } from 'react';
import type { Feedback } from '../types';
import { api } from '../services/api';
import { Star } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    api.getFeedback().then((res) => {
      if (res.success) setFeedbacks(res.data);
    });
  }, []);

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Citizen Feedback & Satisfaction</h2>
          <p className="text-xs text-slate-500">Post-resolution redressal ratings from citizens</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-900 text-sm">{avgRating} / 5.0</span>
          <span className="text-xs text-amber-700 font-medium">({feedbacks.length} Reviews)</span>
        </div>
      </div>

      <div className="space-y-3">
        {feedbacks.length === 0 ? (
          <p className="text-center py-12 text-slate-400">No citizen feedback reviews recorded yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {fb.created_at ? new Date(fb.created_at).toLocaleString() : ''}
                </span>
              </div>
              {fb.comment && <p className="text-sm text-slate-700 italic">"{fb.comment}"</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
