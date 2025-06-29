import React, { useState, useRef } from 'react';
import { Paperclip, Send, Mic, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[] | { id: string; name: string; size: number; type: string; }[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    const attachments = files.map((file, i) => ({
      id: `${Date.now()}_${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onSendMessage(input.trim(), attachments);
    setInput('');
    setFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
      event.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Din webbläsare stöder inte röstigenkänning.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'sv-SE';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error('Röstigenkänningsfel:', event.error);
      setIsRecording(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="p-4">
      <div className="max-w-5xl  mx-auto">
        <div className="relative bg-white rounded-lg shadow-sm border border-primary/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())
            }
            placeholder="Type your message..."
            className="w-full p-3 rounded-t-lg focus:outline-none resize-none min-h-[140px] pr-32"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-1 rounded-full transition-colors ${
                isRecording ? 'text-red-500' : 'text-gray-600 hover:text-primary'
              }`}
              title={isRecording ? 'Stoppa inspelning' : 'Spela in meddelande'}
              type="button"
            >
              <Mic size={20} />
            </button>

            <label
              className="cursor-pointer text-gray-600 hover:text-primary transition-colors p-1 rounded-full"
              title="Bifoga filer"
            >
              <Paperclip size={20} />
              <input type="file" className="hidden" multiple onChange={handleFileUpload} />
            </label>

            <button
              onClick={handleSend}
              className="p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-sm"
              title="Skicka"
              type="button"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-surface border border-primary/20 rounded-lg p-3 shadow-sm mt-2">
            <h4 className="font-semibold mb-2 text-primary">Uppladdade filer:</h4>
            <ul className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center bg-surface rounded px-3 py-1 text-sm shadow"
                >
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Ta bort fil"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
