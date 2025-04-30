'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

const TOTAL_STEPS = 4;

const ProgressBar = () => {
    const currentStep = useSelector((state: RootState) => state.step.currentStep);
    const percent = ((currentStep) / TOTAL_STEPS) * 100;

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 480, md: 440, lg: 768 },
                mt: { xs: 2, sm: 4 },
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 0 },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <span className="text-sm font-medium text-gray-700">{Math.round(percent)}%</span>
            </Box>
            <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                    height: { xs: 8, sm: 12 },
                    borderRadius: 2,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#a3c47c',
                        borderRadius: 2,
                    },
                }}
            />
        </Box>
    );
};

export default ProgressBar;