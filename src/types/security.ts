export type ModuleId =
  | 'dashboard'
  | 'phishing'
  | 'passwords'
  | 'threats'
  | 'trust'
  | 'quiz'
  | 'checklist';

export interface PhishingIndicator {
  id: string;
  type: 'spoofed-sender' | 'urgency' | 'fake-link' | 'attachment' | 'credential-harvest' | 'verified';
  label: string;
  detail: string;
  highlightedText?: string;
}

export interface EmailLink {
  displayText: string;
  actualUrl: string;
  isSuspicious: boolean;
}

export interface EmailAttachment {
  filename: string;
  size: string;
  riskNote: string;
  isDangerous: boolean;
}

export interface PhishingScenario {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  recipientEmail: string;
  timestamp: string;
  category: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  isPhishing: boolean;
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL';
  dkimStatus: 'PASS' | 'FAIL' | 'NONE';
  dmarcStatus: 'PASS' | 'FAIL';
  bodyParagraphs: string[];
  links: EmailLink[];
  attachment?: EmailAttachment;
  indicators: PhishingIndicator[];
  explanation: string;
}

export type ThreatCategory = 'Human-Targeted' | 'Infrastructure' | 'Data & Identity';

export interface ThreatProfile {
  id: string;
  name: string;
  category: ThreatCategory;
  severity: 'Critical' | 'High' | 'Elevated';
  summary: string;
  prevalenceShare: number;
  overview: string;
  killChain: {
    stage: string;
    description: string;
  }[];
  warningSigns: string[];
  prevention: string[];
  mitigation: string[];
}

export interface TrustPillar {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  keyTakeaways: string[];
  bestPractice: string;
}

export interface PermissionAuditItem {
  id: string;
  appContext: string;
  permission: string;
  requestedReason: string;
  isExcessive: boolean;
  explanation: string;
}

export interface MfaMethodComparison {
  id: 'password-only' | 'sms-otp' | 'totp-app' | 'fido2-passkey';
  name: string;
  phishingResistance: number;
  simSwapResistance: number;
  credentialStuffingResistance: number;
  summary: string;
  verdict: 'Vulnerable' | 'Partial Protection' | 'Strong' | 'Phishing-Resistant';
}

export interface QuizQuestion {
  id: string;
  domain: 'Phishing' | 'Authentication' | 'Privacy' | 'Threats' | 'Network';
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardEntry {
  id: string;
  handle: string;
  role: string;
  scorePercent: number;
  completedDate: string;
  isCurrentUser?: boolean;
}

export type ChecklistDomain =
  | 'Account & Identity'
  | 'Device & Software'
  | 'Network & Browsing'
  | 'Privacy & Backup';

export interface ChecklistItem {
  id: string;
  domain: ChecklistDomain;
  priority: 'Critical' | 'High' | 'Recommended';
  title: string;
  description: string;
  impactNote: string;
}

export interface ActivityLogEntry {
  id: string;
  module: ModuleId;
  action: string;
  detail: string;
  timestamp: string;
  outcome: 'positive' | 'warning' | 'neutral';
}

export interface PhishingAnswerRecord {
  userMarkedPhishing: boolean;
  isCorrect: boolean;
  answeredAt: string;
}

export interface UserSecurityProgress {
  phishingAnswers: Record<string, PhishingAnswerRecord>;
  reviewedThreats: string[];
  exploredTrustPillars: string[];
  completedChecklistIds: string[];
  quizBestScore: number | null;
  quizLastScore: number | null;
  quizAttempts: number;
  passwordLabTested: boolean;
  userHandle: string;
  activityLog: ActivityLogEntry[];
}
