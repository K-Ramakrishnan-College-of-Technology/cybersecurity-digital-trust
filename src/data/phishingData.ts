import { PhishingScenario } from '../types/security';

export const PHISHING_SCENARIOS: PhishingScenario[] = [
  {
    id: 'phish-sso-01',
    subject: 'URGENT: Corporate SSO session expiring in 2 hours',
    senderName: 'IT Identity Operations',
    senderEmail: 'security-alerts@okta-verify-portal.com',
    replyToEmail: 'helpdesk-ticket99@mail-relay-srv.net',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Today · 09:14 AM',
    category: 'Credential Harvesting',
    difficulty: 'Foundation',
    isPhishing: true,
    spfStatus: 'FAIL',
    dkimStatus: 'NONE',
    dmarcStatus: 'FAIL',
    bodyParagraphs: [
      'Your single sign-on token has flagged an anomalous session renewal conflict. Failure to re-authenticate within 2 hours will automatically lock access to email, payroll, and Git repositories.',
      'Use the emergency validation link below to confirm your corporate password and MFA backup code immediately.'
    ],
    links: [
      {
        displayText: 'https://sso.northstar-labs.org/validate',
        actualUrl: 'http://okta-verify-portal.com/login/northstar-session',
        isSuspicious: true
      }
    ],
    indicators: [
      {
        id: 'ind-1',
        type: 'spoofed-sender',
        label: 'Lookalike Sender Domain',
        detail: 'Sent from "okta-verify-portal.com" instead of your organization domain or official okta.com.',
        highlightedText: 'security-alerts@okta-verify-portal.com'
      },
      {
        id: 'ind-2',
        type: 'fake-link',
        label: 'Mismatched Destination URL',
        detail: 'Display text claims northstar-labs.org, but the actual link routes to an unencrypted HTTP lookalike domain.',
        highlightedText: 'http://okta-verify-portal.com/login/northstar-session'
      },
      {
        id: 'ind-3',
        type: 'urgency',
        label: 'Artificial 2-Hour Lockout Threat',
        detail: 'Pressures you to act quickly without verifying through internal IT channels, and asks for MFA backup codes.'
      }
    ],
    explanation:
      'Classic credential-harvesting phishing. Legitimate IT teams never ask for MFA backup codes via unverified external links, and SPF/DMARC checks both failed.'
  },
  {
    id: 'legit-github-02',
    subject: 'Security alert: New SSH public key added to your account',
    senderName: 'GitHub',
    senderEmail: 'noreply@github.com',
    replyToEmail: 'noreply@github.com',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Today · 08:42 AM',
    category: 'Account Notification',
    difficulty: 'Intermediate',
    isPhishing: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    bodyParagraphs: [
      'Hey alexchen-dev,',
      'A new SSH key (ED25519 fingerprint SHA256:9xK2...m8Qp) was added to your account on 2026-11-21 at 08:41 UTC from workstation "MacBook-Pro-Work".',
      'If you added this key, no action is needed. If you do not recognize this activity, visit your official account security settings directly by typing github.com in your browser.'
    ],
    links: [
      {
        displayText: 'https://github.com/settings/keys',
        actualUrl: 'https://github.com/settings/keys',
        isSuspicious: false
      }
    ],
    indicators: [
      {
        id: 'ind-legit-1',
        type: 'verified',
        label: 'Authenticated Sender & Matching Domain',
        detail: 'SPF, DKIM, and DMARC all pass for github.com with matching Reply-To address.'
      },
      {
        id: 'ind-legit-2',
        type: 'verified',
        label: 'Non-Coercive Guidance',
        detail: 'Does not demand passwords or urgent action, and encourages navigating directly to settings.'
      }
    ],
    explanation:
      'This is a legitimate security notification. Notice that the sender, reply-to, and link destination all point to verified github.com over HTTPS, and all email authentication checks pass.'
  },
  {
    id: 'phish-ceo-03',
    subject: 'Quick favor before my board call - confidential',
    senderName: 'Elena Vance (CEO)',
    senderEmail: 'elena.vance.exec@gmail.com',
    replyToEmail: 'elena.vance.exec@gmail.com',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Yesterday · 04:51 PM',
    category: 'Business Email Compromise',
    difficulty: 'Foundation',
    isPhishing: true,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    bodyParagraphs: [
      'Hi Alex — I am stepping into a closed investor briefing and cannot take calls right now.',
      'I need you to process an urgent $2,400 vendor gift-card purchase for client appreciation today. Keep this confidential until the announcement and reply with the redemption codes as soon as purchased. I will reimburse via finance tomorrow morning.'
    ],
    links: [],
    indicators: [
      {
        id: 'ind-ceo-1',
        type: 'spoofed-sender',
        label: 'Personal Free Webmail Impersonation',
        detail: 'Display name says "Elena Vance (CEO)", but the actual address uses a free @gmail.com account rather than @northstar-labs.org.',
        highlightedText: 'elena.vance.exec@gmail.com'
      },
      {
        id: 'ind-ceo-2',
        type: 'urgency',
        label: 'Secrecy + Out-of-Band Isolation',
        detail: 'Claims "cannot take calls" and requests secrecy to bypass dual-approval finance controls.'
      }
    ],
    explanation:
      'Business Email Compromise (BEC) / CEO Fraud. Notice that SPF/DKIM pass because the attacker really sent it from a Gmail account—proving why inspecting the actual sender domain is critical.'
  },
  {
    id: 'phish-invoice-04',
    subject: 'Overdue Remittance Notice — Invoice #INV-88412',
    senderName: 'Apex Cloud Billing',
    senderEmail: 'billing@apexcloud-invoices.co',
    replyToEmail: 'ar-dept@apexcloud-invoices.co',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Yesterday · 01:18 PM',
    category: 'Malicious Attachment',
    difficulty: 'Intermediate',
    isPhishing: true,
    spfStatus: 'SOFTFAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    bodyParagraphs: [
      'Dear Accounts Payable,',
      'Attached is the final remittance statement for overdue infrastructure charges totaling $4,890.00. Late fees accrue automatically after 5:00 PM today.',
      'Open the attached encrypted invoice document in your browser to view line-item details and dispute codes.'
    ],
    links: [],
    attachment: {
      filename: 'INV-88412_Encrypted_View.html',
      size: '148 KB',
      riskNote: 'HTML attachments can execute local JavaScript to render fake login portals offline.',
      isDangerous: true
    },
    indicators: [
      {
        id: 'ind-att-1',
        type: 'attachment',
        label: 'High-Risk HTML Attachment',
        detail: 'Legitimate billing portals do not send .html files disguised as "encrypted invoices"—these commonly host local credential-theft forms.',
        highlightedText: 'INV-88412_Encrypted_View.html'
      },
      {
        id: 'ind-att-2',
        type: 'spoofed-sender',
        label: 'Failed DKIM / DMARC Alignment',
        detail: 'Sender authentication failed and uses an unfamiliar .co domain.'
      }
    ],
    explanation:
      'HTML attachment smuggling is widely used to bypass URL scanners. Opening `.html` attachments locally launches a browser page controlled by the attacker.'
  },
  {
    id: 'legit-payroll-05',
    subject: 'Your November compensation statement is ready',
    senderName: 'Workday Payroll Alerts',
    senderEmail: 'notifications@northstar-labs.org',
    replyToEmail: 'no-reply@northstar-labs.org',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Nov 19 · 07:00 AM',
    category: 'Internal HR Notice',
    difficulty: 'Intermediate',
    isPhishing: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    bodyParagraphs: [
      'Hello Alex,',
      'Your November pay statement is now available in the internal employee portal.',
      'For your security, no sensitive figures are included in this email. Access your statement by opening your bookmarked company HR portal or signing in at portal.northstar-labs.org.'
    ],
    links: [
      {
        displayText: 'https://portal.northstar-labs.org/payroll',
        actualUrl: 'https://portal.northstar-labs.org/payroll',
        isSuspicious: false
      }
    ],
    indicators: [
      {
        id: 'ind-pay-1',
        type: 'verified',
        label: 'Verified Internal Domain & Auth',
        detail: 'Sent from @northstar-labs.org with full SPF/DKIM/DMARC PASS.'
      },
      {
        id: 'ind-pay-2',
        type: 'verified',
        label: 'No Direct Credential Request',
        detail: 'Links strictly to the official HTTPS subdomain and encourages bookmark access.'
      }
    ],
    explanation:
      'This message is legitimate. It comes from your verified internal domain, passes all authentication checks, creates no artificial panic, and routes directly to your organization HTTPS domain.'
  },
  {
    id: 'phish-oauth-06',
    subject: 'Action Required: Re-authorize Cloud Drive Storage Connector',
    senderName: 'Workspace App Admin',
    senderEmail: 'admin-apps@workspace-sync-auth.com',
    replyToEmail: 'support@workspace-sync-auth.com',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Nov 18 · 03:27 PM',
    category: 'Consent / OAuth Phishing',
    difficulty: 'Advanced',
    isPhishing: true,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    bodyParagraphs: [
      'Our scheduled API migration requires all engineering staff to grant updated OAuth permissions to the "Drive Backup Helper v3" connector.',
      'Click below and select "Allow" on the permissions screen so your shared project folders continue syncing.'
    ],
    links: [
      {
        displayText: 'Review OAuth Permissions',
        actualUrl: 'https://accounts.google.com.oauth-consent.workspace-sync-auth.com/authorize?scope=mail.read+drive.all',
        isSuspicious: true
      }
    ],
    indicators: [
      {
        id: 'ind-oauth-1',
        type: 'fake-link',
        label: 'Subdomain Deception Trick',
        detail: 'The URL starts with "accounts.google.com" as a subdomain prefix, but the actual registered domain is "workspace-sync-auth.com".',
        highlightedText: 'accounts.google.com.oauth-consent.workspace-sync-auth.com'
      },
      {
        id: 'ind-oauth-2',
        type: 'credential-harvest',
        label: 'Over-Privileged OAuth Scope Request',
        detail: 'Requests broad read access to all mail and drive files (mail.read + drive.all) for an unverified third-party app.'
      }
    ],
    explanation:
      'Subdomain spoofing combined with OAuth consent phishing. Always read the root domain immediately before the first single "/" (here: workspace-sync-auth.com, not google.com).'
  },
  {
    id: 'phish-delivery-07',
    subject: 'Delivery Exception: Address confirmation fee ($1.95) required',
    senderName: 'Global Express Parcel',
    senderEmail: 'dispatch@global-express-parcel-track.info',
    replyToEmail: 'noreply@global-express-parcel-track.info',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Nov 17 · 11:05 AM',
    category: 'Financial / Payment Scam',
    difficulty: 'Foundation',
    isPhishing: true,
    spfStatus: 'FAIL',
    dkimStatus: 'FAIL',
    dmarcStatus: 'FAIL',
    bodyParagraphs: [
      'Your package #GX-904821 could not be delivered due to an incomplete postal code.',
      'To reschedule delivery within 24 hours before the parcel is returned to sender, confirm your shipping address and pay a $1.95 redelivery processing fee.'
    ],
    links: [
      {
        displayText: 'Confirm Redelivery Address',
        actualUrl: 'https://bit.ly/3xTrackParcelReschedule',
        isSuspicious: true
      }
    ],
    indicators: [
      {
        id: 'ind-del-1',
        type: 'fake-link',
        label: 'Obfuscated URL Shortener',
        detail: 'Uses a public URL shortener (bit.ly) to hide the real payment-harvesting destination.'
      },
      {
        id: 'ind-del-2',
        type: 'urgency',
        label: 'Micro-Fee Card Harvesting Lure',
        detail: 'Small $1.95 fee tricks victims into entering full credit card numbers and CVVs on attacker-controlled forms.'
      }
    ],
    explanation:
      'Parcel redelivery micro-fee scams harvest credit card data and personal addresses. Major couriers do not charge card fees via shortened links from .info domains.'
  },
  {
    id: 'legit-bank-08',
    subject: 'Reminder: Scheduled maintenance window this Sunday',
    senderName: 'Pacific Meridian Bank',
    senderEmail: 'service@pacificmeridianbank.com',
    replyToEmail: 'service@pacificmeridianbank.com',
    recipientEmail: 'alex.chen@northstar-labs.org',
    timestamp: 'Nov 16 · 05:30 PM',
    category: 'Service Advisory',
    difficulty: 'Advanced',
    isPhishing: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    bodyParagraphs: [
      'Dear Customer,',
      'Pacific Meridian Bank will perform routine core infrastructure maintenance on Sunday from 02:00 AM to 04:00 AM PT. Online wire transfers may be briefly queued during this 2-hour window.',
      'No action is required on your part. We will never ask you for your PIN, one-time passcode, or password by email or phone.'
    ],
    links: [],
    indicators: [
      {
        id: 'ind-bank-1',
        type: 'verified',
        label: 'Zero Action Links or Attachments',
        detail: 'Informational notice only, passes SPF/DKIM/DMARC, and explicitly reminds users not to share credentials.'
      }
    ],
    explanation:
      'Legitimate service advisory. Even though it mentions banking, it asks for zero clicks, zero downloads, and zero credentials while passing all authentication checks.'
  }
];
