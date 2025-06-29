import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { WebsiteWidget } from './components/WebsiteWidget';
import { BotsView } from './components/BotsView';
import { PromptLibrary } from './components/PromptLibrary';
import { useChatStore } from './store/store';

function App() {
  const initializeStore = useChatStore((state) => state.initializeStore);
  const preferences = useChatStore((state) => state.preferences);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);

  return (
    <Router>
      <div className={`flex h-screen ${preferences.theme === 'dark' ? 'bg-gray-900' : 'bg-[#F8F6E8]'}`}>
        <Routes>
          <Route path="/bots" element={<BotsView />} />
          <Route path="/prompts" element={<PromptLibrary />} />
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <ChatArea />
                <WebsiteWidget />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
