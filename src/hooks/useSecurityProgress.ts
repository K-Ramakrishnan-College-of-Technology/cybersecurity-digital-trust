import { useCallback, useEffect, useMemo, useState } from 'react';
import { PHISHING_SCENARIOS } from '../data/phishingData';
import { THREAT_PROFILES } from '../data/threatsData';
import { SECURITY_CHECKLIST_ITEMS, TRUST_PILLARS } from '../data/trustAndQuizData';
import { ActivityLogEntry, ModuleId, UserSecurityProgress } from '../types/security';

const STORAGE_KEY = 'cyber_digital_trust_progress_v1';

const DEFAULT_PROGRESS: UserSecurityProgress = {
  phishingAnswers: {},
  reviewedThreats: ['threat-phishing'],
  exploredTrustPillars: ['pillar-mfa'],
  completedChecklistIds: ['chk-1', 'chk-5'],
  quizBestScore: null,
  quizLastScore: null,
  quizAttempts: 0,
  passwordLabTested: false,
  userHandle: 'You (Local Session)',
  activityLog: [
    {
      id: 'init-1',
      module: 'checklist',
      action: 'Baseline control verified',
      detail: 'OS & browser automatic updates enabled',
      timestamp: 'Today · 09:00 AM',
      outcome: 'positive'
    },
    {
      id: 'init-2',
      module: 'threats',
      action: 'Threat briefing opened',
      detail: 'Reviewed Phishing & Spear-Phishing kill chain',
      timestamp: 'Today · 08:45 AM',
      outcome: 'neutral'
    }
  ]
};

function sanitizeState(raw: unknown): UserSecurityProgress {
  if (!raw || typeof raw !== 'object') return DEFAULT_PROGRESS;
  const obj = raw as Record<string, unknown>;
  return {
    phishingAnswers:
      obj.phishingAnswers && typeof obj.phishingAnswers === 'object'
        ? (obj.phishingAnswers as UserSecurityProgress['phishingAnswers'])
        : DEFAULT_PROGRESS.phishingAnswers,
    reviewedThreats: Array.isArray(obj.reviewedThreats)
      ? obj.reviewedThreats.filter((v): v is string => typeof v === 'string')
      : DEFAULT_PROGRESS.reviewedThreats,
    exploredTrustPillars: Array.isArray(obj.exploredTrustPillars)
      ? obj.exploredTrustPillars.filter((v): v is string => typeof v === 'string')
      : DEFAULT_PROGRESS.exploredTrustPillars,
    completedChecklistIds: Array.isArray(obj.completedChecklistIds)
      ? obj.completedChecklistIds.filter((v): v is string => typeof v === 'string')
      : DEFAULT_PROGRESS.completedChecklistIds,
    quizBestScore: typeof obj.quizBestScore === 'number' ? obj.quizBestScore : null,
    quizLastScore: typeof obj.quizLastScore === 'number' ? obj.quizLastScore : null,
    quizAttempts: typeof obj.quizAttempts === 'number' ? obj.quizAttempts : 0,
    passwordLabTested: typeof obj.passwordLabTested === 'boolean' ? obj.passwordLabTested : false,
    userHandle:
      typeof obj.userHandle === 'string' && obj.userHandle.trim().length > 0
        ? obj.userHandle.trim().slice(0, 28)
        : DEFAULT_PROGRESS.userHandle,
    activityLog: Array.isArray(obj.activityLog)
      ? (obj.activityLog as ActivityLogEntry[]).slice(0, 25)
      : DEFAULT_PROGRESS.activityLog
  };
}

function formatCurrentTime(): string {
  const now = new Date();
  return `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function useSecurityProgress() {
  const [progress, setProgress] = useState<UserSecurityProgress>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_PROGRESS;
      return sanitizeState(JSON.parse(saved));
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    try {
      const cleanPayload = JSON.parse(JSON.stringify(progress));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPayload));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [progress]);

  const appendLog = useCallback(
    (
      prev: UserSecurityProgress,
      module: ModuleId,
      action: string,
      detail: string,
      outcome: ActivityLogEntry['outcome']
    ): ActivityLogEntry[] => {
      const entry: ActivityLogEntry = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        module,
        action,
        detail,
        timestamp: formatCurrentTime(),
        outcome
      };
      return [entry, ...prev.activityLog].slice(0, 20);
    },
    []
  );

  const recordPhishingAnswer = useCallback(
    (scenarioId: string, userMarkedPhishing: boolean, isCorrect: boolean, subject: string) => {
      setProgress((prev) => ({
        ...prev,
        phishingAnswers: {
          ...prev.phishingAnswers,
          [scenarioId]: {
            userMarkedPhishing,
            isCorrect,
            answeredAt: formatCurrentTime()
          }
        },
        activityLog: appendLog(
          prev,
          'phishing',
          isCorrect ? 'Phishing triage accurate' : 'Phishing triage missed',
          `${isCorrect ? 'Correctly classified' : 'Misclassified'}: "${subject.slice(0, 48)}"`,
          isCorrect ? 'positive' : 'warning'
        )
      }));
    },
    [appendLog]
  );

  const toggleThreatReviewed = useCallback(
    (threatId: string, threatName: string) => {
      setProgress((prev) => {
        const exists = prev.reviewedThreats.includes(threatId);
        const nextList = exists
          ? prev.reviewedThreats.filter((id) => id !== threatId)
          : [...prev.reviewedThreats, threatId];
        return {
          ...prev,
          reviewedThreats: nextList,
          activityLog: exists
            ? prev.activityLog
            : appendLog(prev, 'threats', 'Threat briefing completed', `Reviewed ${threatName}`, 'positive')
        };
      });
    },
    [appendLog]
  );

  const markTrustPillarExplored = useCallback(
    (pillarId: string, pillarTitle: string) => {
      setProgress((prev) => {
        if (prev.exploredTrustPillars.includes(pillarId)) return prev;
        return {
          ...prev,
          exploredTrustPillars: [...prev.exploredTrustPillars, pillarId],
          activityLog: appendLog(
            prev,
            'trust',
            'Trust & privacy guide studied',
            `Explored ${pillarTitle}`,
            'positive'
          )
        };
      });
    },
    [appendLog]
  );

  const toggleChecklistItem = useCallback(
    (itemId: string, itemTitle: string) => {
      setProgress((prev) => {
        const exists = prev.completedChecklistIds.includes(itemId);
        const nextIds = exists
          ? prev.completedChecklistIds.filter((id) => id !== itemId)
          : [...prev.completedChecklistIds, itemId];
        return {
          ...prev,
          completedChecklistIds: nextIds,
          activityLog: appendLog(
            prev,
            'checklist',
            exists ? 'Control unchecked' : 'Security control verified',
            itemTitle,
            exists ? 'neutral' : 'positive'
          )
        };
      });
    },
    [appendLog]
  );

  const markPasswordLabTested = useCallback(() => {
    setProgress((prev) => {
      if (prev.passwordLabTested) return prev;
      return {
        ...prev,
        passwordLabTested: true,
        activityLog: appendLog(
          prev,
          'passwords',
          'Password entropy analyzed',
          'Evaluated credential resistance locally in browser memory',
          'positive'
        )
      };
    });
  }, [appendLog]);

  const recordQuizCompletion = useCallback(
    (scorePercent: number, correctCount: number, totalCount: number) => {
      setProgress((prev) => ({
        ...prev,
        quizLastScore: scorePercent,
        quizBestScore: prev.quizBestScore === null ? scorePercent : Math.max(prev.quizBestScore, scorePercent),
        quizAttempts: prev.quizAttempts + 1,
        activityLog: appendLog(
          prev,
          'quiz',
          'Cybersecurity assessment completed',
          `Scored ${scorePercent}% (${correctCount}/${totalCount} correct)`,
          scorePercent >= 70 ? 'positive' : 'warning'
        )
      }));
    },
    [appendLog]
  );

  const setUserHandle = useCallback((handle: string) => {
    const clean = handle.replace(/[<>]/g, '').trim().slice(0, 28);
    setProgress((prev) => ({
      ...prev,
      userHandle: clean || 'You (Local Session)'
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const metrics = useMemo(() => {
    const phishingEntries = Object.values(progress.phishingAnswers);
    const phishingCompleted = phishingEntries.length;
    const phishingCorrect = phishingEntries.filter((a) => a.isCorrect).length;
    const phishingAccuracy =
      phishingCompleted > 0 ? Math.round((phishingCorrect / phishingCompleted) * 100) : 0;

    const checklistCount = progress.completedChecklistIds.length;
    const checklistTotal = SECURITY_CHECKLIST_ITEMS.length;
    const checklistPercent = Math.round((checklistCount / checklistTotal) * 100);

    const threatsCount = progress.reviewedThreats.length;
    const threatsTotal = THREAT_PROFILES.length;

    const trustCount = progress.exploredTrustPillars.length;
    const trustTotal = TRUST_PILLARS.length;

    const quizScore = progress.quizBestScore ?? 0;

    // Weighted overall security posture score (0 - 100)
    const weightedChecklist = (checklistCount / checklistTotal) * 35;
    const weightedPhishing = (phishingCorrect / PHISHING_SCENARIOS.length) * 25;
    const weightedQuiz = (quizScore / 100) * 25;
    const weightedExploration =
      (threatsCount / threatsTotal) * 8 +
      (trustCount / trustTotal) * 5 +
      (progress.passwordLabTested ? 2 : 0);

    const overallScore = Math.min(
      100,
      Math.round(weightedChecklist + weightedPhishing + weightedQuiz + weightedExploration)
    );

    const scoreTier =
      overallScore >= 80
        ? 'Hardened'
        : overallScore >= 55
          ? 'Resilient'
          : overallScore >= 30
            ? 'Developing'
            : 'Exposed';

    // Domain breakdown for 5-axis radar chart (0-100)
    const identityChecklistIds = ['chk-1', 'chk-2', 'chk-3', 'chk-4'];
    const deviceChecklistIds = ['chk-5', 'chk-6', 'chk-7', 'chk-8'];
    const networkChecklistIds = ['chk-9', 'chk-10', 'chk-11', 'chk-12'];
    const privacyChecklistIds = ['chk-13', 'chk-14', 'chk-15', 'chk-16'];

    const countDone = (ids: string[]) =>
      ids.filter((id) => progress.completedChecklistIds.includes(id)).length;

    const radarAxes = [
      {
        label: 'Identity & Auth',
        value: Math.min(
          100,
          Math.round((countDone(identityChecklistIds) / 4) * 75 + (progress.passwordLabTested ? 25 : 10))
        )
      },
      {
        label: 'Phishing Defense',
        value: Math.min(
          100,
          Math.round((phishingCorrect / PHISHING_SCENARIOS.length) * 85 + (phishingCompleted > 0 ? 15 : 10))
        )
      },
      {
        label: 'Data Privacy',
        value: Math.min(
          100,
          Math.round((countDone(privacyChecklistIds) / 4) * 60 + (trustCount / trustTotal) * 40)
        )
      },
      {
        label: 'Device & Network',
        value: Math.min(
          100,
          Math.round(((countDone(deviceChecklistIds) + countDone(networkChecklistIds)) / 8) * 100)
        )
      },
      {
        label: 'Threat Mastery',
        value: Math.min(
          100,
          Math.round((threatsCount / threatsTotal) * 50 + (quizScore / 100) * 50)
        )
      }
    ];

    return {
      overallScore,
      scoreTier,
      phishingCompleted,
      phishingCorrect,
      phishingTotal: PHISHING_SCENARIOS.length,
      phishingAccuracy,
      checklistCount,
      checklistTotal,
      checklistPercent,
      threatsCount,
      threatsTotal,
      trustCount,
      trustTotal,
      quizScore,
      radarAxes
    };
  }, [progress]);

  return {
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
  };
}
