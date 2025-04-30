'use client';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { prevQuestion, resetStep } from '../features/step/stepSlice';

const Stepnavigator = () => {
    const dispatch = useDispatch();
    const { currentStep, currentQuestion } = useSelector((state: RootState) => state.step);

    const handlePrev = useCallback(() => {
        dispatch(prevQuestion());
    }, [dispatch]);

    const handleExit = useCallback(() => {
        localStorage.removeItem('traya_form_answers');
        dispatch(resetStep());
    }, [dispatch]);

    return (
        <div className="flex justify-between items-center font-bold max-w-5xl w-full text-black">
            <button
                className="cursor-pointer flex items-center px-4 py-2 disabled:opacity-50 underline"
                onClick={handlePrev}
                disabled={currentStep === 0 && currentQuestion === 0}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>
            <button
                className="cursor-pointer flex items-center px-4 py-2 underline font-bold"
                onClick={handleExit}
            >
                Exit
            </button>
        </div>
    );
};

export default Stepnavigator;