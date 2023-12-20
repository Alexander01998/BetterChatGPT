import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';

import TickIcon from '@icon/TickIcon';

const CloneChat = React.memo(() => {
  const { t } = useTranslation();

  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const [cloned, setCloned] = useState<boolean>(false);

  const cloneChat = () => {
    const chats = useStore.getState().chats;

    if (chats) {
      const index = useStore.getState().currentChatIndex;
      // find "v2", "v3", etc. at the end of the title
      const vMatches = chats[index].title.match(/v\d+$/g);
      // get the version as an integer
      const oldVersion = vMatches ? parseInt(vMatches[0].slice(1)) : 1;
      let i = oldVersion + 1;
      // increment the version
      let title = `${chats[index].title} v${i}`;

      // further increment the version if it already exists
      while (chats.some((chat) => chat.title === title)) {
        i += 1;
        title = `${chats[index].title} v${i}`;
      }

      const clonedChat = JSON.parse(JSON.stringify(chats[index]));
      clonedChat.title = title;

      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats.unshift(clonedChat);

      setChats(updatedChats);
      setCurrentChatIndex(useStore.getState().currentChatIndex + 1);
      setCloned(true);

      window.setTimeout(() => {
        setCloned(false);
      }, 3000);
    }
  };

  return (
    <button
      className='btn btn-neutral flex gap-1'
      aria-label={t('cloneChat') as string}
      onClick={cloneChat}
    >
      {cloned ? (
        <>
          <TickIcon /> {t('cloned')}
        </>
      ) : (
        <>{t('cloneChat')}</>
      )}
    </button>
  );
});

export default CloneChat;
