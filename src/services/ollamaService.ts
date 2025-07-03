const OLLAMA_URL = 'http://localhost:11434';

export async function checkOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function generateResponse(prompt: string, contextTokens: number[] = []): Promise<Response> {
  const OLLAMA_URL = 'http://localhost:11434/api/generate';

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt,
        context: contextTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get response from Ollama:', errorText);
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}

export async function generateSummary(textToSummarize: string): Promise<string> {
  const summaryPrompt = `Summarize the following conversation briefly:\n\n${textToSummarize}`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt: summaryPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get summary from Ollama:', errorText);
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    const data = await response.json();
    return data.response || 'No summary generated.';
  } catch (error) {
    console.error('Error in generateSummary:', error);
    throw error;
  }
}

export async function* streamResponse(response: Response): AsyncGenerator<string, void, unknown> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('NO_RESPONSE_BODY');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              yield parsed.response;
            }
          } catch (e) {
            console.warn('Failed to parse JSON line:', e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}