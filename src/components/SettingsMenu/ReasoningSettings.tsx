import React, { useMemo } from 'react';
import useStore from '@store/store';

const ReasoningSettings = () => {
	const reasoningEffort = useStore((s) => s.reasoningEffort);
	const setReasoningEffort = useStore((s) => s.setReasoningEffort);
	const reasoningMaxTokens = useStore((s) => s.reasoningMaxTokens);
	const setReasoningMaxTokens = useStore((s) => s.setReasoningMaxTokens);

	const effortOptions = useMemo(() => ['low', 'medium', 'high'] as const, []);

	return (
		<div className='flex flex-col gap-2 w-full'>
			<div className='text-gray-900 dark:text-gray-300 text-sm font-semibold'>Reasoning</div>
			<div className='flex items-center gap-3'>
				<label className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>Effort</label>
				<select
					className='text-gray-800 dark:text-white p-2 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md h-8 focus:outline-none'
					value={reasoningEffort}
					onChange={(e) => setReasoningEffort(e.target.value as 'low' | 'medium' | 'high')}
				>
					{effortOptions.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>
			<div className='flex items-center gap-3'>
				<label className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>Max tokens</label>
				<input
					type='range'
					min={1}
					max={400000}
					step={100}
					value={reasoningMaxTokens}
					onChange={(e) => setReasoningMaxTokens(Number(e.target.value))}
					className='w-48'
				/>
				<input
					type='number'
					className='text-gray-800 dark:text-white p-2 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md h-8 focus:outline-none w-28'
					value={reasoningMaxTokens}
					onChange={(e) => setReasoningMaxTokens(Number(e.target.value))}
					min={1}
					max={400000}
				/>
			</div>
			<div className='text-xs text-gray-500 dark:text-gray-400'>
				Applied automatically: effort for OpenAI API and non-Anthropic models on OpenRouter; max_tokens for Anthropic models on OpenRouter.
			</div>
		</div>
	);
};

export default ReasoningSettings;