'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { nextQuestion, setAnswer } from '../features/step/stepSlice';
import Image from 'next/image';

interface Question {
    id: string;
    question: string;
    type: string;
    options?: string[];
    placeholder?: string;
    subOpt?: (string | null)[];
}

const questionsByStep: Question[][] = [
    // Step 1: About You
    [
        {
            id: 'name',
            question: 'Before we start, can we get your name?',
            type: 'text',
            placeholder: 'Enter your name',
        },
        {
            id: 'number',
            question: 'What is your number?',
            type: 'text',
            placeholder: 'Enter your number',
        },
        {
            id: 'gender',
            question: 'What is your gender?',
            type: 'label',
            options: ['Male', 'Female'],
        },
        {
            id: 'age',
            question: 'How old are you?',
            type: 'text',
            placeholder: 'Enter your age',
        },

    ],
    // Step 2: Hair Health
    [
        {
            id: 'hair_loss_stage',
            question: 'Which image best describes your hair loss?',
            type: 'radio',
        },
        {
            id: 'hair_dandruff',
            question: 'Do you have dandruff?',
            type: 'radio',
            options: ['No', 'Yes, mild that comes and goes', 'Yes, heavy dandruff that sticks to the scalp', 'I have psoriasis', 'I have seborrheic dermatitis'],
            subOpt: [null, null, null, 'A skin condition that casues red, dry patches on your scalp', 'A condtion making your scalp itchy, red with burning feeling']
        },
    ],
    // Step 3: Internal Health
    [
        {
            id: 'sleep',
            question: 'How well do you sleep? ',
            type: 'radio',
            options: ['Very peacefully for 6-8 hours', 'Disturbed sleep, I wake up atleast one time during the night', 'Have difficulty falling asleep'],
        },
        {
            id: 'medical_conditions',
            question: 'How stressed are you?',
            type: 'radio',
            options: ['None', 'Low', 'Moderate(work, family etc)', 'High(Loss of clsoe one, seperation, home, illness)'],
        },
        {
            id: 'medications',
            question: 'Do you feel constipated?',
            type: 'radio',
            options: ['No/Rarely', 'Yes', 'Unsatisfactory bowel movements', 'Suffering from IBS (Irritable Bowel Syndrome)/dysentry'],
            subOpt: []

        },
        {
            id: 'stress_level',
            question: 'Do you have Gas, Acidity or Bloating?',
            type: 'radio',
            options: ['Yes', 'No'],
        },
        {
            id: 'stress_level',
            question: 'How are your energy levels?',
            type: 'radio',
            options: ['Always high', 'Low when I wake up, but gradually increases', 'Very low in afternoon', 'Low by evening/night', 'Always low'],
        },
        {
            id: 'stress_level',
            question: 'Are you currently taking any supplements or vitamins for hair?',
            type: 'radio',
            options: ['Yes', 'No'],
        },
    ],
    // Step 4: Scalp Assessment
    [
        {
            id: 'scalp_type',
            question: 'Upload your scalp picture, for our doctors to check',
            type: 'image_upload',
        },
    ],
];

const CameraModal = ({
    open,
    onClose,
    onCapture,
}: {
    open: boolean;
    onClose: () => void;
    onCapture: (dataUrl: string) => void;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (open) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                })
                .catch((err) => {
                    alert('Could not access camera: ' + err.message);
                    onClose();
                });
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                streamRef.current = null;
            }
        };
    }, [open, onClose]);

    const handleCapture = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            onCapture(dataUrl);
        }
        onClose();
    };

    if (!open) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <video ref={videoRef} style={{ width: 1000, height: 600, background: '#000' }} />
                <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                    <button onClick={handleCapture} style={{ padding: '8px 16px', background: '#a3c47c', color: '#fff', border: 'none', borderRadius: 8 }}>Capture</button>
                    <button onClick={onClose} style={{ padding: '8px 16px', background: '#ccc', color: '#333', border: 'none', borderRadius: 8 }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const Questions = () => {
    const dispatch = useDispatch();
    const { currentStep, currentQuestion, answers } = useSelector((state: RootState) => state.step);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraOpen, setCameraOpen] = useState(false);

    const questions = useMemo(() => questionsByStep[currentStep] || [], [currentStep]);
    const q = useMemo(() => questions[currentQuestion], [questions, currentQuestion]);

    useEffect(() => {
        const savedAnswers = localStorage.getItem('traya_form_answers');
        if (savedAnswers) {
            try {
                const parsed = JSON.parse(savedAnswers);
                Object.entries(parsed).forEach(([id, value]) => {
                    dispatch(setAnswer({ id, value }));
                });
            } catch { }
        }
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('traya_form_answers', JSON.stringify(answers));
    }, [answers]);

    const handleChange = useCallback((id: string, value: any) => {
        dispatch(setAnswer({ id, value }));
    }, [dispatch]);

    const handleNext = useCallback(() => {
        dispatch(nextQuestion());
    }, [dispatch]);

    const handleValidatedNext = useCallback(() => {
        if (q?.id === 'name' && (!answers['name'] || answers['name'].trim() === '')) {
            alert('Please enter your name');
            return;
        }
        if (q?.id === 'number' && (!answers['number'] || answers['number'].trim() === '')) {
            alert('Please enter your phone number');
            return;
        }
        if (q?.id === 'age' && (!answers['age'] || answers['age'].trim() === '')) {
            alert('Please enter your age');
            return;
        }
        handleNext();
    }, [q, answers, handleNext]);

    const handleTextInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!q) return;
        if (q.id === 'number') {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 10) {
                alert('Please enter valid 10 digit number');
                val = val.slice(0, 10);
            }
            handleChange(q.id, val);
        } else if (q.id === 'age') {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 3) {
                val = val.slice(0, 3);
            }
            handleChange(q.id, val);
        } else {
            handleChange(q.id, e.target.value);
        }
    }, [q, handleChange]);

    const handleRadioOrLabel = useCallback((id: string, value: string) => {
        handleChange(id, value);
        setTimeout(() => {
            handleNext();
        }, 500);
    }, [handleChange, handleNext]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCapturedImage(url);
        }
    }, []);

    const handleCameraCapture = useCallback((dataUrl: string) => {
        setCapturedImage(dataUrl);
    }, []);

    return (
        <div className="flex flex-col items-center w-full mt-8">
            {q && (
                <div key={q.id} className="flex flex-col w-full max-w-3xl text-black">
                    <label className="flex justify-start font-bold text-2xl text-[#363a43] mb-32 mt-4 ml-8">
                        {q.question}
                    </label>
                    {q.type === 'text' && (
                        <div className="w-full mb-16 flex justify-center">
                            <input
                                type="text"
                                className="w-full text-2xl font-normal outline-none border-b-2 border-[#a3c47c] focus:border-[#a3c47c] bg-transparent px-0 py-2"
                                placeholder={q.placeholder || ''}
                                value={answers[q.id] || ''}
                                onChange={handleTextInputChange}
                                autoFocus
                            />
                        </div>
                    )}

                    {q.type === 'radio' && (
                        <div className="flex flex-col gap-8 ml-14 mt-[-80px]">
                            {q.options?.map((opt: string, idx: number) => (
                                <React.Fragment key={opt}>
                                    <label className="cursor-pointer flex items-center gap-2 text-xl">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt}
                                            checked={answers[q.id] === opt}
                                            onChange={() => handleRadioOrLabel(q.id, opt)}
                                        />
                                        {opt}
                                    </label>
                                    {q.id === 'hair_dandruff' && Array.isArray((q as any).subOpt) && (q as any).subOpt[idx] && (
                                        <div className="text-base text-gray-500 mt-[-30px] ml-5">{(q as any).subOpt[idx]}</div>
                                    )}
                                    <div className="w-full border-b border-gray-300 mt-[-30px]"></div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {q.type === 'label' && (
                        <div className="flex gap-8 mb-16 justify-center">
                            {q.options?.map((opt: string) => (
                                <div
                                    key={opt}
                                    className={`cursor-pointer rounded-lg px-8 py-5 min-w-[180px] flex items-center justify-center transition-all duration-200 text-xl
                                        ${answers[q.id] === opt
                                            ? 'bg-[#a3c47c] text-white font-bold shadow-lg border-2 border-[#a3c47c]'
                                            : 'bg-gray-200 text-black font-normal border-2 border-gray-200'}
                                    `}
                                    onClick={() => handleRadioOrLabel(q.id, opt)}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}

                    {q.type === 'image_upload' && (
                        <div className="flex flex-col items-center justify-center gap-8 mt-[-100px] w-full">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="upload-photo-input"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <CameraModal
                                    open={cameraOpen}
                                    onClose={() => setCameraOpen(false)}
                                    onCapture={handleCameraCapture}
                                />
                                <Image
                                    src={capturedImage || '/assets/bald_man.jpeg'}
                                    alt=""
                                    className="rounded-2xl cursor-pointer"
                                    width={200}
                                    height={100}
                                    onClick={() => document.getElementById('scalp-photo-input')?.click()}
                                />
                            </div>
                            <div>Try clicking a photo like the sample above</div>
                            <div className='flex w-full mt-[-20px] justify-center gap-8'>
                                <button
                                    onClick={() => document.getElementById('upload-photo-input')?.click()}
                                    className="cursor-pointer px-6 py-3 w-60 text-black text-md font-medium rounded-lg border border-gray-800 bg-white"
                                >
                                    UPLOAD SCALP PHOTO
                                </button>
                                <button
                                    onClick={() => setCameraOpen(true)}
                                    className="cursor-pointer px-6 py-3 w-60 bg-[#363537] text-white text-md font-medium rounded-lg"
                                >
                                    TAKE A PICTURE
                                </button>
                            </div>
                        </div>
                    )}

                    {q.id === 'hair_loss_stage' && (
                        <div className="grid grid-cols-2 gap-6 w-full mt-[-30px]">
                            {[
                                { label: 'Stage-1', value: 'stage-1' },
                                { label: 'Stage-2', value: 'stage-2' },
                                { label: 'Stage-3', value: 'stage-3' },
                                { label: 'Stage-4', value: 'stage-4' },
                                { label: 'Stage-5', value: 'stage-5' },
                                { label: 'Stage-6', value: 'stage-6' },
                                { label: 'Coin Size Patch', value: 'coin-size-patch' },
                                { label: 'Heavy Hair Fall', value: 'heavy-hair-fall' },
                            ].map(opt => (
                                <div
                                    key={opt.value}
                                    className={`flex items-center gap-6 p-4 rounded-lg border-2 cursor-pointer transition-all
                                        ${answers[q.id] === opt.value
                                            ? 'border-[#a3c47c] bg-[#f6fbf0]'
                                            : 'border-gray-200 bg-[#fafafa]'}
                                    `}
                                    onClick={() => handleRadioOrLabel(q.id, opt.value)}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt.value}
                                            checked={answers[q.id] === opt.value}
                                            onChange={() => handleRadioOrLabel(q.id, opt.value)}
                                            className=""
                                        />
                                        <span className="font-semibold text-lg ml-3">{opt.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(q?.id === 'name' || q?.id === 'age' || q?.id === 'number') && (
                <div className="flex justify-center w-full px-4 ">
                    <button
                        className="cursor-pointer w-full sm:mt-[-10px] sm:max-w-md md:max-w-lg lg:max-w-xl mt-4 px-4 py-3 bg-[#363537] text-white text-lg md:text-xl lg:text-2xl font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
                        onClick={handleValidatedNext}
                        disabled={currentQuestion === questions.length - 1 && currentStep === questionsByStep.length - 1}
                    >
                        NEXT
                        <span className="ml-2 text-lg md:text-xl lg:text-2xl">&#8594;</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Questions;