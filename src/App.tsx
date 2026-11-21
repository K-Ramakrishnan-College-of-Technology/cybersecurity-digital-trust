import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutShell } from './components/LayoutShell';
import { ChecklistView } from './components/views/ChecklistView';
import { DashboardView } from './components/views/DashboardView';
import { DigitalTrustView } from './components/views/DigitalTrustView';
import { PasswordLabView } from './components/views/PasswordLabView';
import { PhishingLabView } from './components/views/PhishingLabView';
import { QuizView } from './components/views/QuizView';
import { ThreatExplorerView } from './components/views/ThreatExplorerView';
import { useSecurityProgress } from './hooks/useSecurityProgress';
import { ModuleId } from './types/security';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const {
    progress,
    metrics,
    recordPhishingAnswer,
    toggleThreatReviewed,
    markTrustPillarExplored,
    toggleChecklistItem,
    markPasswordLabTested,
    recordQuizCompletion,
    setUserHandle,
    resetProgress
  } = useSecurityProgress();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            metrics={metrics}
            activityLog={progress.activityLog}
            onNavigate={setActiveModule}
          />
        );
      case 'phishing':
        return (
          <PhishingLabView
            answers={progress.phishingAnswers}
            onRecordAnswer={recordPhishingAnswer}
          />
        );
      case 'passwords':
        return <PasswordLabView onPasswordTested={markPasswordLabTested} />;
      case 'threats':
        return (
          <ThreatExplorerView
            reviewedThreats={progress.reviewedThreats}
            onToggleReviewed={toggleThreatReviewed}
          />
        );
      case 'trust':
        return (
          <DigitalTrustView
            exploredPillars={progress.exploredTrustPillars}
            onExplorePillar={markTrustPillarExplored}
          />
        );
      case 'quiz':
        return (
          <QuizView
            bestScore={progress.quizBestScore}
            lastScore={progress.quizLastScore}
            attempts={progress.quizAttempts}
            userHandle={progress.userHandle}
            onSetUserHandle={setUserHandle}
            onCompleteQuiz={recordQuizCompletion}
          />
        );
      case 'checklist':
        return (
          <ChecklistView
            completedIds={progress.completedChecklistIds}
            onToggleItem={toggleChecklistItem}
          />
        );
    }
  };

  return (
    <LayoutShell
      activeModule={activeModule}
      onSelectModule={setActiveModule}
      overallScore={metrics.overallScore}
      scoreTier={metrics.scoreTier}
      onResetProgress={resetProgress}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </LayoutShell>
  );
}
