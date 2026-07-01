interface AIResponseBubbleProps {
  reply: string;
  comparison?: string;
}

export default function AIResponseBubble({ reply, comparison }: AIResponseBubbleProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl p-8 mb-10 flex items-start gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
      
      <div className="bg-primary/10 p-3.5 rounded-2xl text-primary flex-shrink-0 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-3 text-xl tracking-tight">AI Advisor</h3>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">{reply}</p>
        
        {comparison && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base uppercase tracking-wider">
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/></svg>
              </span>
              Top 3 Comparison
            </h4>
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-wrap">{comparison}</p>
          </div>
        )}
      </div>
    </div>
  );
}
