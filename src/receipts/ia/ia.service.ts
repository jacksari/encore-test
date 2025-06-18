import OpenAI from 'openai';
import fs from 'fs';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

class AIClass {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, _model: string) {
    this.openai = new OpenAI({ apiKey });
    if (!apiKey || apiKey.length === 0) {
      throw new Error('OPENAI_KEY is missing');
    }

    this.model = _model;
  }

  useModel = () => {
    return this.openai;
  };

  /**
   *
   * @param path
   * @returns
   */
  voiceToText = async (path: fs.PathLike) => {
    if (!fs.existsSync(path)) {
      throw new Error('No se encuentra el archivo');
    }

    try {
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(path),
        model: 'whisper-1',
      });

      return transcription.text;
    } catch (err) {
      return 'ERROR';
    }
  };

  /**
   *
   * @param messages
   * @param model
   * @param temperature
   * @returns
   */
  createChat = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0.2,
  ) => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        messages,
        temperature,
        // max_tokens: 200,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        // stream: false,
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return 'ERROR';
    }
  };

  createChatStream = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0.2,
    stream = true, // activamos el stream
  ) => {
    const completion = await this.openai.chat.completions.create({
      model: model ?? this.model,
      messages,
      temperature,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream, // aseguramos que el stream esté habilitado
    });
    return completion;
  };

  //const thread = await openai.beta.threads.create();
  createThread = async () => {
    const thread = await this.openai.beta.threads.create();
    return thread;
  };

  createMessageAssistant = async (question: string, thread_id: string) => {
    const message = this.openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: question,
    });

    return message;
  };

  createRun = async (thread_id: string, assistant_id: string) => {
    const run = this.openai.beta.threads.runs.create(thread_id, {
      assistant_id,
      stream: true,
    });
    return run;
  };

  getMessagesByThread = async (thread_id: string) => {
    const messageList = await this.openai.beta.threads.messages.list(thread_id);
    const messages = messageList.data.map((message) => ({
      role: message.role,
      content: message.content.map((content) => (content as any).text.value),
    }));
    return messages;
  };
}

export const ai = new AIClass(
  process.env.OPENIA_TOKEN as string,
  'gpt-4o-mini',
);
