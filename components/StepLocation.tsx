'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const steps = [
    ['About', 'You'],
    ['Hair', 'Health'],
    ['Internal', 'Health'],
    ['Scalp', 'Assessment'],
];

const StepLocation = () => {
    const currentStep = useSelector((state: RootState) => state.step.currentStep);
    const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);

    useEffect(() => {
        if (!localStorage.getItem('traya_form_answers')) {
            setVisitedSteps([0]);
        } else if (!visitedSteps.includes(currentStep)) {
            setVisitedSteps(prev => [...prev, currentStep]);
        }
        // eslint-disable-next-line
    }, [currentStep]);

    const visitedSet = useMemo(() => new Set(visitedSteps), [visitedSteps]);

    return (
        <div className="flex flex-wrap justify-center items-center w-full max-w-6xl gap-2 sm:gap-4 mx-auto mt-1 px-2 sm:px-4">
            {steps.map((labels, idx) => {
                let className =
                    'rounded-lg px-4 py-3 sm:px-8 sm:py-5 min-w-[140px] sm:min-w-[200px] md:min-w-[240px] flex flex-col justify-center items-center transition-all duration-200 ';
                if (idx === currentStep) {
                    className += 'bg-[#a3c47c] text-white font-bold shadow-lg';
                } else if (visitedSet.has(idx)) {
                    className += 'bg-[#a3c47c]/40 text-white font-bold';
                } else {
                    className += 'bg-gray-200 text-black font-normal';
                }
                return (
                    <div key={idx} className={className}>
                        <span className="text-base sm:text-lg md:text-xl font-medium">{labels[0]}</span>
                        <span className="text-base sm:text-lg md:text-xl font-medium">{labels[1]}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepLocation;