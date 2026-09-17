import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewPage from './pages/InterviewPage';
import InterviewResultPage from './pages/InterviewResultPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import AptitudePage from './pages/AptitudePage';
import AptitudeResultPage from './pages/AptitudeResultPage';
import AptitudePracticeSetupPage from './pages/AptitudePracticeSetupPage';
import TechnicalPracticeSetupPage from './pages/TechnicalPracticeSetupPage';
import TechnicalPracticePage from './pages/TechnicalPracticePage';
import TechnicalPracticeResultPage from './pages/TechnicalPracticeResultPage';
import CommunicationInterviewSetupPage from './pages/CommunicationInterviewSetupPage';
import CommunicationInterviewPage from './pages/CommunicationInterviewPage';
import CommunicationInterviewResultPage from './pages/CommunicationInterviewResultPage';
import SpeakingChallengeSetupPage from './pages/SpeakingChallengeSetupPage';
import SpeakingChallengePage from './pages/SpeakingChallengePage';
import SpeakingChallengeResultPage from './pages/SpeakingChallengeResultPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentAptitudePage from './pages/AssessmentAptitudePage';
import AssessmentAptitudeResultPage from './pages/AssessmentAptitudeResultPage';
import AssessmentTechnicalPage from './pages/AssessmentTechnicalPage';
import AssessmentTechnicalResultPage from './pages/AssessmentTechnicalResultPage';
import AssessmentInterviewPage from './pages/AssessmentInterviewPage';
import AssessmentResultPage from './pages/AssessmentResultPage';
import ProblemSolvingPage from './pages/ProblemSolvingPage';
import PracticeCenterPage from './pages/PracticeCenterPage';
import PerformancePage from './pages/PerformancePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/performance" element={<PerformancePage />} />

            {/* Practice Center Hub & Deliberate Practice */}
            <Route path="/practice" element={<PracticeCenterPage />} />
            <Route path="/practice/aptitude" element={<AptitudePracticeSetupPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/assessment/aptitude" element={<AssessmentAptitudePage />} />
            <Route path="/assessment/aptitude/result" element={<AssessmentAptitudeResultPage />} />
            <Route path="/assessment/technical" element={<AssessmentTechnicalPage />} />
            <Route path="/assessment/technical/result" element={<AssessmentTechnicalResultPage />} />
            <Route path="/assessment/interview" element={<AssessmentInterviewPage />} />
            <Route path="/assessment/result" element={<AssessmentResultPage />} />

            {/* Problem Solving / DSA Practice Module */}
            <Route path="/problem-solving" element={<ProblemSolvingPage />} />
            <Route path="/problem-solving/:problemId" element={<ProblemSolvingPage />} />

            {/* Deliberate Practice & Mock Systems (Preserved Intact) */}
            <Route path="/practice/aptitude" element={<AptitudePracticeSetupPage />} />
            <Route path="/practice/technical" element={<TechnicalPracticeSetupPage />} />
            <Route path="/practice/technical/session" element={<TechnicalPracticePage />} />
            <Route path="/practice/technical/result" element={<TechnicalPracticeResultPage />} />
            <Route path="/aptitude" element={<AptitudePage />} />
            <Route path="/aptitude/result" element={<AptitudeResultPage />} />
            <Route path="/interview/setup" element={<InterviewSetupPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/result" element={<InterviewResultPage />} />
            <Route path="/interview/history" element={<InterviewHistoryPage />} />
            <Route path="/communication" element={<CommunicationInterviewSetupPage />} />
            <Route path="/communication/interview" element={<CommunicationInterviewPage />} />
            <Route path="/communication/result/:id" element={<CommunicationInterviewResultPage />} />
            <Route path="/communication/challenge/setup" element={<SpeakingChallengeSetupPage />} />
            <Route path="/communication/challenge" element={<SpeakingChallengePage />} />
            <Route path="/communication/challenge/result/:id" element={<SpeakingChallengeResultPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
