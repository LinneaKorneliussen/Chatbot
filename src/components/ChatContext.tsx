import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface ChatContextProps {
  summary: string | null;
}

export const ChatContext: React.FC<ChatContextProps> = ({ summary }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!summary) return null;

  return (
    <div
      className="
        sticky top-4 mx-auto max-w-xl
        bg-gradient-to-r from-blue-50 to-white
        border border-blue-200
        rounded-2xl
        p-5
        shadow-md
        flex flex-col gap-2
        z-40
      "
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4">
          <BookOpen size={28} className="text-blue-600 flex-shrink-0" />
          <p className="text-blue-700 font-semibold text-lg select-none">Context Summary</p>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-blue-600" />
        ) : (
          <ChevronDown size={20} className="text-blue-600" />
        )}
      </div>
      {isOpen && <p className="text-blue-600 text-sm leading-relaxed">{summary}</p>}
    </div>
  );
};
