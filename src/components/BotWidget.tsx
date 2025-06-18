import React from 'react';
import { useChatStore } from '../store/store';
import { Brain, Code, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  code: Code,
  'bar-chart': BarChart,
};

export const BotWidget = () => {
  const navigate = useNavigate();
  const bots = useChatStore((state) => state.bots);
  const currentThreadId = useChatStore((state) => state.currentThreadId);
  const threads = useChatStore((state) => state.threads);
  const createThread = useChatStore((state) => state.createThread);
  const addMessage = useChatStore((state) => state.addMessage);

  const currentThread = threads.find(t => t.id === currentThreadId);
  const currentBot = currentThread?.botId ? bots.find(b => b.id === currentThread.botId) : null;

  return (
    <div className="w-16 bg-background h-screen flex flex-col items-center py-4">
      {bots.map((bot) => {
        const Icon = iconMap[bot.icon] || Brain;
        const isActive = currentBot?.id === bot.id;

        return (
          <button
            key={bot.id}
            onClick={() => {
              const threadId = createThread();
              addMessage(threadId, {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Hi! I'm ${bot.name}. ${bot.description} How can I help you today?`,
                timestamp: new Date(),
                isPinned: false
              });
              navigate('/');
            }}
            className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-all
              ${isActive
                ? 'bg-primary text-accent shadow-lg scale-110'
                : 'bg-secondary text-surface hover:bg-accent hover:text-primary'
              }`}
            title={bot.name}
          >
            <Icon size={24} />
          </button>
        );
      })}
    </div>
  );
};
