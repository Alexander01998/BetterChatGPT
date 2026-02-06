import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { ReasoningDetailInterface } from '@type/chat';

/**
 * Checks if reasoning_details contains any encrypted blocks.
 */
const hasEncryptedBlocks = (details?: ReasoningDetailInterface[]): boolean => {
  return details?.some(d => d.type === 'reasoning.encrypted') ?? false;
};

/**
 * Checks if reasoning_details contains only encrypted/summary blocks (no readable text).
 */
const isOpaqueReasoning = (details?: ReasoningDetailInterface[]): boolean => {
  if (!details || details.length === 0) return false;
  return details.every(d => d.type === 'reasoning.encrypted' || d.type === 'reasoning.summary');
};

/**
 * Extract display text from reasoning_details for opaque reasoning blocks.
 * Returns summary text if available, otherwise a description of encrypted blocks.
 */
const getOpaqueReasoningDisplay = (details: ReasoningDetailInterface[], t: (key: string) => string): string => {
  const summaries = details
    .filter(d => d.type === 'reasoning.summary' && d.summary)
    .map(d => d.summary!);
  
  if (summaries.length > 0) {
    return summaries.join('\n\n');
  }

  const encryptedCount = details.filter(d => d.type === 'reasoning.encrypted').length;
  return t('reasoning.encryptedBlocks').replace('{{count}}', String(encryptedCount));
};

const STREAMING_VISIBLE_LINES = 8;

const StreamingReasoningView = memo(({ text }: { text: string }) => {
  const lines = text.split('\n');
  const visibleLines = lines.length > STREAMING_VISIBLE_LINES
    ? lines.slice(-STREAMING_VISIBLE_LINES)
    : lines;
  const isTruncated = lines.length > STREAMING_VISIBLE_LINES;

  return (
    <div className='reasoning-streaming mb-3 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden'>
      <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600'>
        <ThinkingIcon />
        <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
          Thinking
        </span>
        <span className='thinking-dots text-xs text-gray-500 dark:text-gray-400'>
          <span className='dot'>.</span><span className='dot'>.</span><span className='dot'>.</span>
        </span>
      </div>
      <div className='px-3 py-2 max-h-40 overflow-hidden'>
        {isTruncated && (
          <div className='text-xs text-gray-400 dark:text-gray-500 mb-1'>...</div>
        )}
        <pre className='text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono leading-relaxed m-0'>
          {visibleLines.join('\n')}
        </pre>
      </div>
    </div>
  );
});

const CollapsedReasoningView = memo(({
  text,
  details,
  isEditable,
}: {
  text: string;
  details?: ReasoningDetailInterface[];
  isEditable: boolean;
}) => {
  const { t } = useTranslation('main');
  const opaque = isOpaqueReasoning(details);
  const encrypted = hasEncryptedBlocks(details);

  const displayText = useMemo(() => {
    if (opaque && details) {
      return getOpaqueReasoningDisplay(details, t);
    }
    return text;
  }, [text, details, opaque, t]);

  const lineCount = text.split('\n').length;
  const charCount = text.length;

  const summaryLabel = opaque
    ? (encrypted
      ? t('reasoning.encryptedLabel')
      : t('reasoning.summaryLabel'))
    : `${t('reasoning.label')} (${lineCount} ${lineCount === 1 ? 'line' : 'lines'}, ${charCount.toLocaleString()} chars)`;

  return (
    <details className={`reasoning-collapsed mb-3 border rounded-md overflow-hidden ${
      isEditable
        ? 'border-gray-300 dark:border-gray-600'
        : 'border-gray-300/60 dark:border-gray-600/60 opacity-75'
    }`}>
      <summary className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 cursor-pointer select-none text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
        <ThinkingIcon />
        <span>{summaryLabel}</span>
        {!isEditable && (
          <span className='text-gray-400 dark:text-gray-500 ml-auto text-[10px] italic'>
            {t('reasoning.readOnly')}
          </span>
        )}
      </summary>
      <div className='px-3 py-2'>
        <pre className='text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono leading-relaxed m-0'>
          {displayText}
        </pre>
      </div>
    </details>
  );
});

const ReasoningBlock = memo(({
  messageIndex,
}: {
  messageIndex: number;
}) => {
  const generating = useStore((state) => state.generating);
  const preserveReasoning = useStore((state) => state.preserveReasoning);

  const reasoning = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    const msg = chat?.messages[messageIndex];
    return msg?.reasoning;
  });

  const reasoningDetails = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    const msg = chat?.messages[messageIndex];
    return msg?.reasoning_details;
  });

  const isLastMessage = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    if (!chat) return false;
    return messageIndex === chat.messages.length - 1;
  });

  // Check if content has started (meaning reasoning phase is complete)
  const hasContent = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    const msg = chat?.messages[messageIndex];
    if (!msg) return false;
    const textContent = msg.content[0] as { type: string; text?: string };
    return textContent?.text ? textContent.text.length > 0 : false;
  });

  // No reasoning data - don't render anything
  if (!reasoning && (!reasoningDetails || reasoningDetails.length === 0)) {
    return null;
  }

  // Reasoning is still streaming if: generating, last message, AND content hasn't started yet
  const isReasoningStreaming = generating && isLastMessage && !hasContent;
  const text = reasoning || '';

  if (isReasoningStreaming && text) {
    return <StreamingReasoningView text={text} />;
  }

  if (text) {
    return (
      <CollapsedReasoningView
        text={text}
        details={reasoningDetails}
        isEditable={preserveReasoning}
      />
    );
  }

  // If we only have reasoning_details (no extracted text, e.g. only encrypted)
  if (reasoningDetails && reasoningDetails.length > 0) {
    return (
      <CollapsedReasoningView
        text=''
        details={reasoningDetails}
        isEditable={preserveReasoning}
      />
    );
  }

  return null;
});

const ThinkingIcon = () => (
  <svg
    className='w-3.5 h-3.5 flex-shrink-0'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.4V20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.6c2.9-1.1 5-4 5-7.4a8 8 0 0 0-8-8z' />
    <line x1='9' y1='23' x2='15' y2='23' />
  </svg>
);

export default ReasoningBlock;
