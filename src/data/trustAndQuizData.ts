import {
  ChecklistItem,
  LeaderboardEntry,
  MfaMethodComparison,
  PermissionAuditItem,
  QuizQuestion,
  TrustPillar
} from '../types/security';

export const TRUST_PILLARS: TrustPillar[] = [
  {
    id: 'pillar-privacy',
    title: 'Data Privacy & Minimization',
    subtitle: 'Collect and share only what is strictly necessary',
    summary:
      'Every extra personal detail stored online expands your breach blast radius. Data minimization limits what services collect, retain, and broker.',
    keyTakeaways: [
      'Use email aliases for newsletters and low-trust signups to trace leaks.',
      'Disable ad personalization and cross-app tracking in OS privacy settings.',
      'Regularly delete dormant accounts so old databases do not expose current passwords.'
    ],
    bestPractice: 'Treat personal identifiers (phone number, DOB, home address) as high-value secrets.'
  },
  {
    id: 'pillar-mfa',
    title: 'Multi-Factor Authentication & Passkeys',
    subtitle: 'Proving identity beyond static secrets',
    summary:
      'Passwords alone are vulnerable to reuse and phishing. Modern FIDO2 Passkeys use public-key cryptography bound to the website origin, neutralizing fake login pages.',
    keyTakeaways: [
      'Prefer FIDO2 Passkeys or hardware security keys for primary email and financial accounts.',
      'Use authenticator apps (TOTP) over SMS OTP whenever hardware keys are unavailable.',
      'Store recovery backup codes offline in an encrypted vault—never in plain cloud notes.'
    ],
    bestPractice: 'Protect your primary email account with your strongest MFA first, as it controls password resets everywhere else.'
  },
  {
    id: 'pillar-encryption',
    title: 'Encryption in Transit & at Rest',
    subtitle: 'Protecting confidentiality across untrusted networks',
    summary:
      'HTTPS (TLS 1.3) prevents Wi-Fi eavesdroppers from reading or altering traffic, while Full-Disk Encryption protects data if a laptop or phone is lost or stolen.',
    keyTakeaways: [
      'Verify HTTPS padlock and exact domain spelling before entering credentials.',
      'Enable FileVault (macOS), BitLocker (Windows), or hardware-backed mobile device encryption.',
      'Use End-to-End Encrypted (E2EE) messaging for sensitive discussions.'
    ],
    bestPractice: 'Turn on HTTPS-Only Mode in your browser so unencrypted HTTP connections trigger a warning.'
  },
  {
    id: 'pillar-browsing',
    title: 'Secure Browsing & DNS Hygiene',
    subtitle: 'Reducing exposure to malvertising and malicious domains',
    summary:
      'Attackers frequently buy promoted search ads targeting popular software downloads. Protective DNS resolvers and browser isolation block known malicious domains before connections open.',
    keyTakeaways: [
      'Configure Encrypted DNS (DNS-over-HTTPS) with malware-blocking resolvers (e.g., Quad9 or Cloudflare 1.1.1.2).',
      'Audit browser extensions quarterly and remove unused or acquired extensions.',
      'Avoid downloading software from sponsored search ads; verify the publisher URL.'
    ],
    bestPractice: 'Keep browser auto-updates active—browser engines patch actively exploited vulnerabilities every few weeks.'
  },
  {
    id: 'pillar-permissions',
    title: 'App Permissions & OAuth Hygiene',
    subtitle: 'Enforcing least privilege across mobile and cloud apps',
    summary:
      'Granting a flashlight app access to contacts or giving an unverified web tool full Google Drive read scope bypasses password security via legitimate API tokens.',
    keyTakeaways: [
      'Grant Location, Camera, and Microphone access "Only While Using the App" or "Ask Next Time".',
      'Review third-party OAuth connections inside Google, Microsoft, and GitHub settings every quarter.',
      'Deny background location and full contact-list syncing unless core to the app function.'
    ],
    bestPractice: 'If an app stops working when you deny an unrelated permission, consider it a trust red flag.'
  },
  {
    id: 'pillar-footprint',
    title: 'Digital Footprint & Breach Readiness',
    subtitle: 'Understanding public OSINT exposure',
    summary:
      'Public social posts, linked usernames, and historic data breaches allow attackers to craft hyper-personalized spear-phishing and guess security questions.',
    keyTakeaways: [
      'Never use real answers for "Mother’s maiden name" or "First pet" security questions—treat them as secondary random passwords.',
      'Check if your email appears in historic data leaks using trusted breach notification services.',
      'Lock down public social visibility for birth dates, workplace badges, and travel schedules.'
    ],
    bestPractice: 'Separate public community handles from private banking and identity email addresses.'
  }
];

export const MFA_COMPARISONS: MfaMethodComparison[] = [
  {
    id: 'password-only',
    name: 'Password Only',
    phishingResistance: 10,
    simSwapResistance: 100,
    credentialStuffingResistance: 15,
    summary: 'Single point of failure. Vulnerable to credential stuffing, keyloggers, shoulder surfing, and any phishing page.',
    verdict: 'Vulnerable'
  },
  {
    id: 'sms-otp',
    name: 'SMS Text Code (OTP)',
    phishingResistance: 35,
    simSwapResistance: 20,
    credentialStuffingResistance: 80,
    summary: 'Stops automated credential stuffing, but remains vulnerable to SIM swapping, SS7 interception, and real-time phishing forms.',
    verdict: 'Partial Protection'
  },
  {
    id: 'totp-app',
    name: 'Authenticator App (TOTP)',
    phishingResistance: 55,
    simSwapResistance: 95,
    credentialStuffingResistance: 95,
    summary: 'Eliminates mobile carrier SIM-swap risk, though users can still be tricked into typing the 6-digit code into a lookalike phishing proxy.',
    verdict: 'Strong'
  },
  {
    id: 'fido2-passkey',
    name: 'Passkey / FIDO2 Hardware Key',
    phishingResistance: 99,
    simSwapResistance: 100,
    credentialStuffingResistance: 100,
    summary: 'Cryptographically verifies the exact website domain before signing. Even if you click a perfect phishing link, authentication will not fire.',
    verdict: 'Phishing-Resistant'
  }
];

export const PERMISSION_AUDIT_ITEMS: PermissionAuditItem[] = [
  {
    id: 'perm-1',
    appContext: 'PDF Document Scanner App',
    permission: 'Contacts & Call Logs (Continuous Read)',
    requestedReason: 'Required to enhance document sharing experience',
    isExcessive: true,
    explanation: 'A local PDF scanner only needs temporary Camera and single-file storage picker access—never your address book or call history.'
  },
  {
    id: 'perm-2',
    appContext: 'Video Conferencing Client',
    permission: 'Camera & Microphone (While App Is Active)',
    requestedReason: 'Required for live audio and video calls',
    isExcessive: false,
    explanation: 'Core functionality requires camera and microphone scoped strictly to active call sessions.'
  },
  {
    id: 'perm-3',
    appContext: 'Simple Desk Calculator',
    permission: 'Precise Background Location (Always Allow)',
    requestedReason: 'Used for regional telemetry analytics',
    isExcessive: true,
    explanation: 'A calculator has zero legitimate need for continuous GPS coordinates. Background location is frequently monetized by data brokers.'
  },
  {
    id: 'perm-4',
    appContext: 'Third-Party Calendar Scheduling Widget',
    permission: 'OAuth Scope: Read & Send All Emails + Delete Drive Files',
    requestedReason: 'Sync meeting invites',
    isExcessive: true,
    explanation: 'Excessive OAuth scope. A calendar tool should only request calendar event scopes—never full mailbox or Drive deletion permissions.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    domain: 'Phishing',
    difficulty: 'Foundation',
    question: 'You receive an urgent email from "IT Support" linking to https://company-portal.login-verify.net/sso. Which part of this URL determines the actual destination server?',
    options: [
      'company-portal',
      'login-verify.net',
      '/sso',
      'https://'
    ],
    correctIndex: 1,
    explanation: 'The registered root domain immediately before the first single "/" (login-verify.net) controls the destination. "company-portal" is merely a deceptive subdomain prefix.'
  },
  {
    id: 'q2',
    domain: 'Authentication',
    difficulty: 'Intermediate',
    question: 'Which Multi-Factor Authentication (MFA) method provides the strongest cryptographic protection against Adversary-in-the-Middle phishing sites?',
    options: [
      'SMS one-time passcodes',
      'Email verification links',
      'FIDO2 / WebAuthn Passkeys or Hardware Security Keys',
      'Security questions about your childhood'
    ],
    correctIndex: 2,
    explanation: 'FIDO2/Passkeys bind the cryptographic signature to the exact origin domain, preventing credentials from working on lookalike phishing domains.'
  },
  {
    id: 'q3',
    domain: 'Authentication',
    difficulty: 'Foundation',
    question: 'Why does adding common substitutions like "P@ssw0rd2026!" fail against modern password crackers?',
    options: [
      'Special characters are ignored by login servers',
      'Cracking tools apply automated leetspeak and year rules to dictionary words',
      '13-character passwords cannot be hashed',
      'HTTPS removes special characters during transmission'
    ],
    correctIndex: 1,
    explanation: 'Rule-based dictionary attacks test predictable substitutions (@ for a, 0 for o, trailing years) at billions of guesses per second.'
  },
  {
    id: 'q4',
    domain: 'Threats',
    difficulty: 'Intermediate',
    question: 'What is the most reliable technical defense that allows an organization or individual to recover files after a ransomware encryption attack without paying?',
    options: [
      'Deleting temporary browser cookies',
      'Maintaining tested, offline/immutable 3-2-1 backups',
      'Changing your Wi-Fi router SSID name',
      'Disabling automatic operating system updates'
    ],
    correctIndex: 1,
    explanation: 'Ransomware targets connected drives and writable network shares. Offline or immutable backups ensure clean recovery copies remain untouched.'
  },
  {
    id: 'q5',
    domain: 'Privacy',
    difficulty: 'Intermediate',
    question: 'If an email passes SPF, DKIM, and DMARC checks, what does that guarantee?',
    options: [
      'The email is 100% safe and never phishing',
      'The sending server was authorized by the domain shown in the From address—even if it is an attacker’s own lookalike domain',
      'Any attached .html or .zip file has been proven harmless',
      'The message is end-to-end encrypted'
    ],
    correctIndex: 1,
    explanation: 'SPF/DKIM/DMARC verify domain authenticity, not intent. Attackers routinely pass all three checks when sending from newly registered lookalike domains or free webmail.'
  },
  {
    id: 'q6',
    domain: 'Network',
    difficulty: 'Foundation',
    question: 'On a public airport or coffee-shop Wi-Fi network, what does HTTPS protect?',
    options: [
      'It hides which websites exist on the internet entirely',
      'It encrypts the payload content (passwords, pages, API data) between your browser and the destination site',
      'It removes all malware from downloaded executables',
      'It prevents the website you visit from knowing your account username'
    ],
    correctIndex: 1,
    explanation: 'HTTPS (TLS) encrypts traffic in transit so local Wi-Fi eavesdroppers cannot read or tamper with page contents or login credentials.'
  },
  {
    id: 'q7',
    domain: 'Threats',
    difficulty: 'Advanced',
    question: 'An attacker repeatedly sends MFA push notifications to your phone at 2:00 AM hoping you tap "Approve" just to stop the alerts. What is this attack called?',
    options: [
      'DNS Cache Poisoning',
      'MFA Fatigue / Push Bombing',
      'SQL Injection',
      'ARP Spoofing'
    ],
    correctIndex: 1,
    explanation: 'MFA Fatigue exploits human annoyance or confusion. Using number-matching MFA or FIDO2 passkeys defeats blind push approvals.'
  },
  {
    id: 'q8',
    domain: 'Privacy',
    difficulty: 'Foundation',
    question: 'Why should you store passwords in a dedicated password manager rather than reusing one strong password across 20 sites?',
    options: [
      'Password managers shorten passwords to 6 characters',
      'If one small site suffers a data breach, unique passwords prevent credential stuffing on your bank and email',
      'Browsers reject identical passwords after 30 days',
      'Unique passwords automatically block DDoS traffic'
    ],
    correctIndex: 1,
    explanation: 'A breach at any single low-security website exposes your email and password; unique passwords contain the damage to that one site.'
  },
  {
    id: 'q9',
    domain: 'Network',
    difficulty: 'Intermediate',
    question: 'When granting "Sign in with Google/GitHub" OAuth access to a third-party utility, what should you inspect before clicking Allow?',
    options: [
      'The font color of the consent button',
      'The exact requested permission scopes (e.g., read-only profile vs full email/file access) and verified publisher name',
      'Whether your laptop battery is above 50%',
      'The file size of the browser tab'
    ],
    correctIndex: 1,
    explanation: 'OAuth phishing tricks users into granting broad API tokens (mail read, file write) without ever needing their password.'
  },
  {
    id: 'q10',
    domain: 'Threats',
    difficulty: 'Advanced',
    question: 'A website shows a fake CAPTCHA asking you to press Win+R, paste a command into your terminal, and press Enter to "prove you are human". What is happening?',
    options: [
      'Standard WCAG accessibility validation',
      'A social-engineered malware execution attack (ClickFix) tricking you into running an infostealer',
      'Automated TLS certificate renewal',
      'Hardware passkey pairing'
    ],
    correctIndex: 1,
    explanation: 'Legitimate CAPTCHAs never ask users to open a command prompt or PowerShell. This technique tricks victims into manually launching malware.'
  }
];

export const SIMULATED_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', handle: 'Nadia_SecOps', role: 'Cloud Architect', scorePercent: 100, completedDate: 'Nov 20' },
  { id: 'lb-2', handle: 'MarcusV', role: 'Product Engineer', scorePercent: 90, completedDate: 'Nov 19' },
  { id: 'lb-3', handle: 'PriyaK_Trust', role: 'Privacy Analyst', scorePercent: 90, completedDate: 'Nov 21' },
  { id: 'lb-4', handle: 'Devon_Dev', role: 'Frontend Lead', scorePercent: 80, completedDate: 'Nov 18' },
  { id: 'lb-5', handle: 'Samir_Ops', role: 'IT Support', scorePercent: 70, completedDate: 'Nov 17' }
];

export const SECURITY_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-1',
    domain: 'Account & Identity',
    priority: 'Critical',
    title: 'Use a password manager with unique passwords for every account',
    description: 'Eliminate password reuse so a single third-party breach cannot compromise your email or banking.',
    impactNote: 'Blocks automated credential stuffing across all personal accounts.'
  },
  {
    id: 'chk-2',
    domain: 'Account & Identity',
    priority: 'Critical',
    title: 'Enable phishing-resistant MFA (Passkeys or Authenticator App) on primary email',
    description: 'Protect your primary email first since it acts as the reset key for almost every other online service.',
    impactNote: 'Prevents account takeover even if a password is leaked.'
  },
  {
    id: 'chk-3',
    domain: 'Account & Identity',
    priority: 'High',
    title: 'Set a mobile carrier Port-Out PIN / Number Lock',
    description: 'Require an extra carrier PIN before your phone number can be transferred to a new SIM or eSIM.',
    impactNote: 'Neutralizes common SIM-swapping attacks.'
  },
  {
    id: 'chk-4',
    domain: 'Account & Identity',
    priority: 'Recommended',
    title: 'Store MFA recovery backup codes offline',
    description: 'Keep emergency recovery codes in an encrypted vault or physical safe rather than plain cloud notes.',
    impactNote: 'Prevents permanent lockout if a phone is lost.'
  },
  {
    id: 'chk-5',
    domain: 'Device & Software',
    priority: 'Critical',
    title: 'Enable automatic OS and browser security updates',
    description: 'Keep macOS, Windows, iOS, Android, and primary browsers patched against zero-day exploits.',
    impactNote: 'Closes publicly known vulnerabilities rapidly.'
  },
  {
    id: 'chk-6',
    domain: 'Device & Software',
    priority: 'Critical',
    title: 'Turn on Full-Disk Encryption (BitLocker or FileVault)',
    description: 'Ensure laptop and mobile storage cannot be read if hardware is lost or stolen.',
    impactNote: 'Protects local files and browser sessions offline.'
  },
  {
    id: 'chk-7',
    domain: 'Device & Software',
    priority: 'High',
    title: 'Use a non-administrator standard user account for daily work',
    description: 'Separate daily browsing from administrative privileges where possible.',
    impactNote: 'Limits the blast radius of accidental malware execution.'
  },
  {
    id: 'chk-8',
    domain: 'Device & Software',
    priority: 'Recommended',
    title: 'Configure automatic screen lock (≤ 5 minutes) and biometric/PIN unlock',
    description: 'Prevent unauthorized physical access when stepping away from devices.',
    impactNote: 'Secures unattended sessions in shared spaces.'
  },
  {
    id: 'chk-9',
    domain: 'Network & Browsing',
    priority: 'High',
    title: 'Enable HTTPS-Only Mode and Encrypted DNS (DoH)',
    description: 'Force encrypted web connections and block malicious domains at the DNS resolver layer.',
    impactNote: 'Stops unencrypted snooping and blocks known phishing domains.'
  },
  {
    id: 'chk-10',
    domain: 'Network & Browsing',
    priority: 'High',
    title: 'Audit and remove unused browser extensions',
    description: 'Browser extensions often hold broad page-read permissions; keep only essential, actively maintained ones.',
    impactNote: 'Prevents malicious extension updates from reading sensitive pages.'
  },
  {
    id: 'chk-11',
    domain: 'Network & Browsing',
    priority: 'Recommended',
    title: 'Change default router admin password and enable WPA3/WPA2-AES',
    description: 'Secure home Wi-Fi infrastructure and disable remote router administration from WAN.',
    impactNote: 'Protects local smart devices from lateral network tampering.'
  },
  {
    id: 'chk-12',
    domain: 'Network & Browsing',
    priority: 'Recommended',
    title: 'Bookmark banking and SSO portals instead of clicking email links',
    description: 'Develop the habit of navigating directly via trusted bookmarks for sensitive logins.',
    impactNote: 'Eliminates accidental visits to lookalike phishing URLs.'
  },
  {
    id: 'chk-13',
    domain: 'Privacy & Backup',
    priority: 'Critical',
    title: 'Maintain 3-2-1 backups (including 1 offline or immutable copy)',
    description: 'Keep 3 copies of vital files on 2 media types with 1 isolated offline/cloud versioned backup.',
    impactNote: 'Ensures full recovery from ransomware or hardware failure.'
  },
  {
    id: 'chk-14',
    domain: 'Privacy & Backup',
    priority: 'High',
    title: 'Review third-party OAuth app access on Google, Microsoft, and GitHub',
    description: 'Revoke legacy apps that still hold permissions to read email, contacts, or repositories.',
    impactNote: 'Shrinks third-party supply-chain exposure.'
  },
  {
    id: 'chk-15',
    domain: 'Privacy & Backup',
    priority: 'High',
    title: 'Freeze credit files with major bureaus if not actively applying',
    description: 'Prevent unauthorized credit lines from being opened using leaked personal identifiers.',
    impactNote: 'Blocks financial identity theft even after major data leaks.'
  },
  {
    id: 'chk-16',
    domain: 'Privacy & Backup',
    priority: 'Recommended',
    title: 'Replace real personal trivia in security questions with random vault strings',
    description: 'Avoid predictable answers (high school, pet name) discoverable via social media OSINT.',
    impactNote: 'Closes weak account-recovery backdoors.'
  }
];
