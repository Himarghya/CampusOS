import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-[#162032] rounded-2xl w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#111827] border border-slate-800 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3 pt-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-16 bg-[#111827] border border-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
