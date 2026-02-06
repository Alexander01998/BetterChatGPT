import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

const PreserveReasoningToggle = () => {
  const { t } = useTranslation();

  const setPreserveReasoning = useStore((state) => state.setPreserveReasoning);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().preserveReasoning
  );

  useEffect(() => {
    setPreserveReasoning(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('preserveReasoning') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default PreserveReasoningToggle;
