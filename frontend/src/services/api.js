import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
export const api = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('smart_interview_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const loginUser = async (payload) => (await api.post('/auth/login', payload)).data;
export const registerUser = async (payload) => (await api.post('/auth/register', payload)).data;
export const getProfile = async () => (await api.get('/auth/profile')).data;
export const forgotPassword = async (payload) => (await api.post('/auth/forgot-password', payload)).data;
export const resetPassword = async (token, payload) => (await api.post(`/auth/reset-password/${token}`, payload)).data;
export const startAssessment = async (payload) => (await api.post('/assessment/start', payload)).data;
export const getCurrentAssessment = async () => (await api.get('/assessment/current')).data;

// Round 1: Aptitude Test
export const getAptitudeSession = async () => (await api.get('/assessment/aptitude/current')).data;
export const startAssessmentAptitude = async () => (await api.post('/assessment/aptitude/start')).data;
export const saveAssessmentAptitudeProgress = async (payload) => (await api.post('/assessment/aptitude/save-progress', payload)).data;
export const submitAssessmentAptitude = async (payload) => (await api.post('/assessment/aptitude/submit', payload)).data;
export const getAssessmentAptitudeResult = async () => (await api.get('/assessment/aptitude/result')).data;

// Round 2: Technical MCQ Test
export const getTechnicalSession = async () => (await api.get('/assessment/technical/current')).data;
export const startAssessmentTechnical = async () => (await api.post('/assessment/technical/start')).data;
export const saveAssessmentTechnicalProgress = async (payload) => (await api.post('/assessment/technical/save-progress', payload)).data;
export const submitAssessmentTechnical = async (payload) => (await api.post('/assessment/technical/submit', payload)).data;
export const getAssessmentTechnicalResult = async () => (await api.get('/assessment/technical/result')).data;

// Security Restart Endpoint
export const restartAssessmentRound = async (round, payload = { reason: 'FULLSCREEN_EXIT' }) =>
	(await api.post(`/assessment/${round}/restart`, payload)).data;

// Round 3: One-on-One AI Interview
export const startAssessmentInterview = async () => (await api.post('/assessment/interview/start')).data;
export const getAssessmentInterviewSession = async (interviewId) => {
	const url = interviewId ? `/assessment/interview/${interviewId}` : '/assessment/interview/current';
	return (await api.get(url)).data;
};
export const submitAssessmentInterviewAnswer = async (interviewIdOrPayload, payloadOrIsFormData, isFormData = false) => {
	let url = '/assessment/interview/answer';
	let body = interviewIdOrPayload;
	let config = {};

	if (typeof interviewIdOrPayload === 'string' && interviewIdOrPayload.length > 0) {
		url = `/assessment/interview/${interviewIdOrPayload}/answer`;
		body = payloadOrIsFormData;
		if (isFormData) config.headers = { 'Content-Type': 'multipart/form-data' };
	} else if (payloadOrIsFormData === true) {
		config.headers = { 'Content-Type': 'multipart/form-data' };
	}

	return (await api.post(url, body, config)).data;
};
export const completeAssessmentInterview = async (interviewId) => {
	const url = interviewId ? `/assessment/interview/${interviewId}/complete` : '/assessment/interview/complete';
	return (await api.post(url)).data;
};

// Consolidated Final Result
export const getAssessmentResult = async () => (await api.get('/assessment/result')).data;

// Legacy aliases kept for safety
export const completeAssessmentAptitude = async (payload) => (await api.post('/assessment/aptitude/submit', payload)).data;
export const completeAssessmentTechnical = async (payload) => (await api.post('/assessment/technical/submit', payload)).data;
export const startInterview = async (payload) => (await api.post('/interviews/start', payload)).data;
export const submitAnswer = async (interviewId, payload) => (await api.post(`/interviews/${interviewId}/answer`, payload)).data;
export const getNextQuestion = async (interviewId) => (await api.post(`/interviews/${interviewId}/next-question`)).data;
export const completeInterview = async (interviewId) => (await api.post(`/interviews/${interviewId}/complete`)).data;
export const getInterviewResult = async (interviewId) => (await api.get(`/interviews/${interviewId}/feedback`)).data;
export const getInterviewHistory = async () => (await api.get('/interviews')).data;
export const startAptitude = async (payload) => (await api.post('/aptitude/start', payload)).data;
export const getAptitudeQuestion = async (sessionId, index) => {
	const url = index !== undefined ? `/aptitude/${sessionId}/question?index=${index}` : `/aptitude/${sessionId}/question`;
	return (await api.get(url)).data;
};
export const submitAptitudeAnswer = async (sessionId, payload) => (await api.post(`/aptitude/${sessionId}/answer`, payload)).data;
export const completeAptitude = async (sessionId) => (await api.post(`/aptitude/${sessionId}/complete`)).data;
export const getAptitudeResult = async (sessionId) => (await api.get(`/aptitude/${sessionId}/result`)).data;
export const startTechnicalPractice = async (payload) => (await api.post('/technical-practice/start', payload)).data;
export const getTechnicalPractice = async (sessionId) => (await api.get(`/technical-practice/${sessionId}`)).data;
export const completeTechnicalPractice = async (sessionId, payload) => (await api.post(`/technical-practice/${sessionId}/complete`, payload)).data;
export const getTechnicalPracticeResult = async (sessionId) => (await api.get(`/technical-practice/${sessionId}/result`)).data;
export const startCommunicationInterview = async (payload) => (await api.post('/communication/start', payload)).data;
export const submitCommunicationAnswer = async (interviewId, payload) => (await api.post(`/communication/${interviewId}/answer`, payload, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const getCommunicationInterview = async (interviewId) => (await api.get(`/communication/${interviewId}`)).data;
export const getCommunicationResult = async (interviewId) => (await api.get(`/communication/${interviewId}/result`)).data;
export const startSpeakingChallenge = async (payload) => (await api.post('/speaking-challenge/start', payload)).data;
export const submitSpeakingChallenge = async (challengeId, payload) => (await api.post(`/speaking-challenge/${challengeId}/submit`, payload, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const getSpeakingChallengeResult = async (challengeId) => (await api.get(`/speaking-challenge/${challengeId}/result`)).data;

// Problem Solving / DSA Practice Module
export const getDsaTopics = async () => (await api.get('/problem-solving/topics')).data;
export const listDsaProblems = async (params = {}) => (await api.get('/problem-solving/list', { params })).data;
export const getDsaRecentProblems = async () => (await api.get('/problem-solving/recent')).data;
export const generateDsaProblem = async (payload) => (await api.post('/problem-solving/generate', payload)).data;
export const getDsaProblem = async (problemId) => (await api.get(`/problem-solving/${problemId}`)).data;
export const runDsaCode = async (problemId, payload) => (await api.post(`/problem-solving/${problemId}/run`, payload)).data;
export const submitDsaCode = async (problemId, payload) => (await api.post(`/problem-solving/${problemId}/submit`, payload)).data;
export const getDsaHint = async (problemId, payload) => (await api.post(`/problem-solving/${problemId}/hint`, payload)).data;
export const getDsaReview = async (problemId, payload) => (await api.post(`/problem-solving/${problemId}/review`, payload)).data;
export const getDsaSolution = async (problemId, confirmed = false) => (await api.get(`/problem-solving/${problemId}/solution${confirmed ? '?confirmed=true' : ''}`)).data;
export const getDsaStats = async () => (await api.get('/problem-solving/stats')).data;
export const getDsaHistory = async () => (await api.get('/problem-solving/history')).data;

