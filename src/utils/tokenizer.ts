import { encode } from 'gpt-tokenizer';

export const countTokens = (text: string): number => {
  return encode(text).length;
};

export const summarizeMessages = async (messages: string[]): Promise<string> => {
  const combinedText = messages.join('\n');
  if (combinedText.length <= 300) return combinedText;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:8b', // ändrad till deepseek modell
        prompt: `Please provide a concise summary of the following conversation:\n\n${combinedText}`,
        stream: false
      }),
    });

    const data = await response.json();
    return `Summary of previous messages:\n${data.response}`;
  } catch (error) {
    console.error('Failed to get summary from Ollama:', error);
    return `Summary of previous messages:\n${combinedText.slice(0, 297)}...`;
  }
};
