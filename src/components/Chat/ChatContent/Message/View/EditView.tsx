import React, { memo, useEffect, useState, useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface, Content, ContentInterface, ImageContentInterface, ReasoningDetailInterface, TextContentInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import TokenCount from '@components/TokenCount';
import CommandPrompt from '../CommandPrompt';
import FolderIcon from '@icon/FolderIcon';
import { modelTypes, defaultModel } from '@constants/chat';

const EditView = ({
  content: content,
  setIsEdit,
  messageIndex,
  sticky,
  role,
}: {
  content: ContentInterface[];
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
  role?: string;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const preserveReasoning = useStore((state) => state.preserveReasoning);

  const existingReasoning = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    const msg = chat?.messages[messageIndex];
    return msg?.reasoning;
  });

  const existingReasoningDetails = useStore((state) => {
    const chat = state.chats?.[state.currentChatIndex];
    const msg = chat?.messages[messageIndex];
    return msg?.reasoning_details;
  });

  const isAssistant = role === 'assistant' || (!sticky && !role);
  const hasReasoning = !sticky && isAssistant && (existingReasoning !== undefined && existingReasoning !== null);

  const [_content, _setContent] = useState<ContentInterface[]>(content);
  const [_reasoning, _setReasoning] = useState<string>(existingReasoning || '');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const reasoningTextareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;

      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleGenerate();
        resetTextAreaHeight();
      } else if (
        (enterToSubmit && !e.shiftKey) ||
        (!enterToSubmit && (e.ctrlKey || e.shiftKey))
      ) {
        if (sticky) {
          e.preventDefault();
          handleGenerate();
          resetTextAreaHeight();
        } else {
          handleSave();
        }
      }
    }
  };

  // convert message blob urls to base64
  const blobToBase64 = async (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    const newImageURLs = Array.from(files).map((file: Blob) => URL.createObjectURL(file));
    const newImages = await Promise.all(newImageURLs.map(async (url) => {
      const blob = await fetch(url).then((r) => r.blob());
      return {
        type: 'image_url',
        image_url: {
          detail: 'auto',
          url: await blobToBase64(blob) as string
        }
      } as ImageContentInterface
    }));
    const updatedContent = [..._content, ...newImages];

    _setContent(updatedContent);
  };

  const handleImageDetailChange = (index: number, detail: string) => {
    const updatedImages = [..._content];
    updatedImages[index + 1].image_url.detail = detail;
    _setContent(updatedImages);
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = [..._content];
    updatedImages.splice(index + 1, 1);

    _setContent(updatedImages);
  };

  const handleSave = () => {
    if (sticky && ((_content[0] as TextContentInterface).text === '' || useStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;

    if (sticky) {
      updatedMessages.push({ role: inputRole, content: _content });
      _setContent([{
        type: 'text',
        text: ''
      } as TextContentInterface]);
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      // Save reasoning edits for assistant messages
      if (hasReasoning) {
        updatedMessages[messageIndex].reasoning = _reasoning;
        // If the user edited the reasoning text and there were reasoning_details,
        // we need to update them to reflect the edit (replace with a simple text block)
        if (_reasoning !== existingReasoning && existingReasoningDetails?.length) {
          updatedMessages[messageIndex].reasoning_details = [{
            type: 'reasoning.text' as const,
            text: _reasoning,
          }];
        }
      }
      setIsEdit(false);
    }
    setChats(updatedChats);
  };

  const { handleSubmit } = useSubmit();
  const handleGenerate = () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;

    if (sticky) {
      if ((_content[0] as TextContentInterface).text !== '') {
        updatedMessages.push({ role: inputRole, content: _content });
      }
      _setContent([{
        type: 'text',
        text: ''
      } as TextContentInterface]);
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      // Save reasoning edits before regenerating
      if (hasReasoning) {
        updatedMessages[messageIndex].reasoning = _reasoning;
        if (_reasoning !== existingReasoning && existingReasoningDetails?.length) {
          updatedMessages[messageIndex].reasoning_details = [{
            type: 'reasoning.text' as const,
            text: _reasoning,
          }];
        }
      }
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [(_content[0] as TextContentInterface).text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  // Auto-size reasoning textarea
  useEffect(() => {
    if (reasoningTextareaRef.current) {
      reasoningTextareaRef.current.style.height = 'auto';
      reasoningTextareaRef.current.style.height = `${reasoningTextareaRef.current.scrollHeight}px`;
    }
  }, [_reasoning]);

  useEffect(() => {
    if (reasoningTextareaRef.current) {
      reasoningTextareaRef.current.style.height = 'auto';
      reasoningTextareaRef.current.style.height = `${reasoningTextareaRef.current.scrollHeight}px`;
    }
  }, []);

  // Add clipboard paste handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    const newImages = await Promise.all(imageItems.map(async (item) => {
      const blob = item.getAsFile();
      if (!blob) return null;
      
      return {
        type: 'image_url',
        image_url: {
          detail: 'auto',
          url: await blobToBase64(blob) as string
        }
      } as ImageContentInterface;
    }));

    const validImages = newImages.filter((img): img is ImageContentInterface => img !== null);
    if (validImages.length > 0) {
      const updatedContent = [..._content, ...validImages];
      _setContent(updatedContent);
    }
  };

  return (
    <>
      {hasReasoning && (
        <div className={`mb-2 border rounded-md overflow-hidden ${
          preserveReasoning
            ? 'border-gray-300 dark:border-gray-600'
            : 'border-gray-300/60 dark:border-gray-600/60 opacity-60'
        }`}>
          <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600'>
            <svg className='w-3.5 h-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.4V20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.6c2.9-1.1 5-4 5-7.4a8 8 0 0 0-8-8z' />
              <line x1='9' y1='23' x2='15' y2='23' />
            </svg>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              {t('reasoning.label')}
            </span>
            {!preserveReasoning && (
              <span className='text-[10px] italic text-gray-400 dark:text-gray-500 ml-auto'>
                {t('reasoning.readOnly')}
              </span>
            )}
          </div>
          <textarea
            ref={reasoningTextareaRef}
            className='m-0 resize-none rounded-none bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-6 w-full text-xs font-mono text-gray-600 dark:text-gray-400 px-3 py-2'
            onChange={(e) => _setReasoning(e.target.value)}
            value={_reasoning}
            rows={3}
            readOnly={!preserveReasoning}
          />
        </div>
      )}
      <div
        className={`w-full ${sticky
          ? 'py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
          : ''
          }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40'
          onChange={(e) => {
            _setContent((prev) => [{ type: 'text', text: e.target.value }, ...prev.slice(1)])
          }}
          onPaste={handlePaste}
          value={(_content[0] as TextContentInterface).text}
          placeholder={t('submitPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
        ></textarea>
      </div>
      <EditViewButtons
        sticky={sticky}
        handleFileChange={handleFileChange}
        handleImageDetailChange={handleImageDetailChange}
        handleRemoveImage={handleRemoveImage}
        handleGenerate={handleGenerate}
        handleSave={handleSave}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        _setContent={_setContent}
        _content={_content}
      />
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleGenerate}
        />
      )}
    </>
  );
};

const EditViewButtons = memo(
  ({
    sticky = false,
    handleFileChange,
    handleImageDetailChange,
    handleRemoveImage,
    handleGenerate,
    handleSave,
    setIsModalOpen,
    setIsEdit,
    _setContent,
    _content
  }: {
    sticky?: boolean;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageDetailChange: (index: number, e: string) => void;
    handleRemoveImage: (index: number) => void;
    handleGenerate: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    _setContent: React.Dispatch<React.SetStateAction<ContentInterface[]>>;
    _content: ContentInterface[];
  }) => {
    const { t } = useTranslation();
    const generating = useStore.getState().generating;
    const advancedMode = useStore((state) => state.advancedMode);
    const model = useStore((state) => state.chats?.[state.currentChatIndex]?.config?.model ?? defaultModel);
    const fileInputRef = useRef(null);

    const handleUploadButtonClick = () => {
      // Trigger the file input when the custom button is clicked
      (fileInputRef.current! as HTMLInputElement).click();
    };

    return (
      <div>
        {modelTypes[model] == 'image' && (
          <div className='flex justify-center'>
            <div className="flex gap-5">
              {_content.slice(1).map((image, index) => (
                <div key={index} className="image-container flex flex-col gap-2">
                  <img src={image.image_url.url} alt={`uploaded-${index}`} className="h-10" />
                  <div className='flex flex-row gap-3'>
                  <select
                    onChange={(event) => handleImageDetailChange(index, event.target.value)}
                    title="Select image resolution"
                    aria-label="Select image resolution"
                    defaultValue={image.image_url.detail}
                    style={{ color: 'black' }}
                  >
                    <option value="auto">Auto</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                  <button
                    className="close-button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove Image"
                  >
                    &times;
                  </button>
                  </div>
                </div>
              ))}

            <button
              className='btn relative btn-neutral h-10'
              onClick={handleUploadButtonClick}
              aria-label={'Upload Images'}
            >
              <div className='flex items-center justify-center gap-2'>
                <FolderIcon />
              </div>
            </button>
            
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
          </div>
        )}
        <div className='flex'>
          <div className='flex-1 text-center mt-2 flex justify-center'>
            {sticky && (
              <button
                className={`btn relative mr-2 btn-primary ${generating ? 'cursor-not-allowed opacity-40' : ''
                  }`}
                onClick={handleGenerate}
                aria-label={t('generate') as string}
              >
                <div className='flex items-center justify-center gap-2'>
                  {t('generate')}
                </div>
              </button>
            )}

            {sticky || (
              <button
                className='btn relative mr-2 btn-primary'
                onClick={() => {
                  !generating && setIsModalOpen(true);
                }}
              >
                <div className='flex items-center justify-center gap-2'>
                  {t('generate')}
                </div>
              </button>
            )}

            <button
              className={`btn relative mr-2 ${sticky
                ? `btn-neutral ${generating ? 'cursor-not-allowed opacity-40' : ''
                }`
                : 'btn-neutral'
                }`}
              onClick={handleSave}
              aria-label={t('save') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('save')}
              </div>
            </button>

            {sticky || (
              <button
                className='btn relative btn-neutral'
                onClick={() => setIsEdit(false)}
                aria-label={t('cancel') as string}
              >
                <div className='flex items-center justify-center gap-2'>
                  {t('cancel')}
                </div>
              </button>
            )}
          </div>
          {sticky && advancedMode && <TokenCount />}
          <CommandPrompt _setContent={_setContent} />
        </div>
      </div>
    );
  }
);

export default EditView;
