import { ThreatProfile } from '../types/security';

export const THREAT_PROFILES: ThreatProfile[] = [
  {
    id: 'threat-phishing',
    name: 'Phishing & Spear-Phishing',
    category: 'Human-Targeted',
    severity: 'Critical',
    summary: 'Deceptive messages impersonating trusted brands or colleagues to steal credentials, MFA tokens, or authorize payments.',
    prevalenceShare: 36,
    overview:
      'Phishing remains the leading initial access vector across consumer and enterprise breaches. Modern Adversary-in-the-Middle (AiTM) phishing proxies can even intercept session cookies after SMS or TOTP MFA—making FIDO2 passkeys and domain verification essential.',
    killChain: [
      { stage: '1. Lure & Spoofing', description: 'Attacker registers a lookalike domain or compromises a partner mailbox.' },
      { stage: '2. Psychological Trigger', description: 'Message creates urgency (account lock, overdue invoice, executive request).' },
      { stage: '3. Harvest / Proxy', description: 'Victim enters password or OAuth consent on attacker-controlled infrastructure.' },
      { stage: '4. Lateral Abuse', description: 'Captured session token is used to exfiltrate data or launch internal BEC.' }
    ],
    warningSigns: [
      'Subtle typos or extra hyphens in the sender domain (e.g., rnicrosoft.com or login-company.co).',
      'Mismatched display URL vs actual hover destination.',
      'Urgency demanding action within hours or discouraging phone verification.'
    ],
    prevention: [
      'Use hardware-bound passkeys (FIDO2/WebAuthn) that cryptographically bind to the exact origin domain.',
      'Configure email authentication (SPF, DKIM, DMARC) on organizational domains.',
      'Verify financial or sensitive requests through a known secondary channel (voice/trusted chat).'
    ],
    mitigation: [
      'Immediately revoke active sessions and change compromised passwords from a clean device.',
      'Audit OAuth connected apps and mail forwarding rules created by attackers.',
      'Notify security teams so similar messages can be quarantined across all mailboxes.'
    ]
  },
  {
    id: 'threat-ransomware',
    name: 'Ransomware & Extortion',
    category: 'Infrastructure',
    severity: 'Critical',
    summary: 'Malicious software that encrypts files or systems and demands payment for decryption keys or to prevent public data leaks.',
    prevalenceShare: 22,
    overview:
      'Modern ransomware groups frequently practice "double extortion"—exfiltrating sensitive data before encrypting endpoints, so victims face both operational downtime and breach disclosure pressure.',
    killChain: [
      { stage: '1. Initial Foothold', description: 'Entry via exposed remote desktop (RDP), unpatched VPN, or phishing payload.' },
      { stage: '2. Privilege Escalation', description: 'Attackers harvest local credentials and disable endpoint security tools.' },
      { stage: '3. Data Exfiltration', description: 'Sensitive archives are quietly uploaded prior to detonation.' },
      { stage: '4. Encryption & Demand', description: 'Endpoints and reachable network shares are encrypted with ransom notes.' }
    ],
    warningSigns: [
      'Unexplained CPU/disk spikes, disabled antivirus services, or sudden deletion of Shadow Copies.',
      'Unexpected remote access tools or scheduled tasks running outside maintenance windows.',
      'Files suddenly changing extensions (e.g., .locked, .enc) alongside README text notes.'
    ],
    prevention: [
      'Maintain immutable, offline 3-2-1 backups tested regularly for restoration.',
      'Patch internet-facing services promptly and disable exposed RDP without VPN + MFA.',
      'Enforce least-privilege accounts so standard users cannot install system-wide binaries.'
    ],
    mitigation: [
      'Isolate infected hosts from Wi-Fi/Ethernet immediately without wiping forensic logs.',
      'Verify backup integrity before rebuilding systems on clean OS images.',
      'Check public decryption repositories (e.g., No More Ransom) and report incidents to authorities.'
    ]
  },
  {
    id: 'threat-malware',
    name: 'Malware & Infostealers',
    category: 'Infrastructure',
    severity: 'High',
    summary: 'Hostile software including trojans, spyware, and browser infostealers designed to siphon saved credentials and session cookies.',
    prevalenceShare: 15,
    overview:
      'Commodity infostealers disguised as cracked software, fake browser updates, or malicious PDF/script attachments target browser cookie stores and cryptocurrency wallets within seconds of execution.',
    killChain: [
      { stage: '1. Trojan Delivery', description: 'Bundled inside pirated installers, malvertising search ads, or fake CAPTCHA prompts.' },
      { stage: '2. Execution', description: 'User bypasses OS Gatekeeper/SmartScreen warnings to launch the binary.' },
      { stage: '3. Token Extraction', description: 'Script dumps browser-saved passwords, session cookies, and autofill data.' },
      { stage: '4. Command & Control', description: 'Stolen profile logs are packaged and sold on underground credential markets.' }
    ],
    warningSigns: [
      'Browser extensions appearing without consent or search engine defaults changing.',
      'Websites prompting you to "Copy & Run PowerShell/Terminal command to verify you are human".',
      'Unexpected security alerts from multiple unrelated accounts simultaneously.'
    ],
    prevention: [
      'Install software exclusively from official vendor domains or verified OS app stores.',
      'Keep OS built-in protections (Defender, XProtect, Gatekeeper) enabled and up to date.',
      'Use a dedicated encrypted password manager rather than storing sensitive tokens unencrypted.'
    ],
    mitigation: [
      'Disconnect the device, run full offline malware remediation, or perform a clean OS reinstall.',
      'Rotate passwords and sign out of all active browser sessions from a known clean device.',
      'Check Have I Been Pwned / breach monitors for newly exposed credential pairs.'
    ]
  },
  {
    id: 'threat-social-eng',
    name: 'Social Engineering & Pretexting',
    category: 'Human-Targeted',
    severity: 'High',
    summary: 'Psychological manipulation exploiting helpfulness, authority, or fear to bypass technical controls without touching code.',
    prevalenceShare: 12,
    overview:
      'Attackers craft believable scenarios ("pretexts")—such as posing as IT support on a voice call (vishing) or SMS (smishing)—to persuade targets into approving MFA push notifications or revealing verification codes.',
    killChain: [
      { stage: '1. OSINT Profiling', description: 'Attacker gathers job titles, org charts, and recent events from public social profiles.' },
      { stage: '2. Trust Framing', description: 'Initiates contact posing as IT helpdesk, HR, or a trusted vendor.' },
      { stage: '3. Control Bypass', description: 'Asks target to approve an "MFA reset push" or install a remote support tool.' },
      { stage: '4. Account Takeover', description: 'Attacker enrolls their own MFA device and locks out the legitimate owner.' }
    ],
    warningSigns: [
      'Unsolicited calls asking you to read back a 6-digit SMS code or approve an MFA prompt.',
      'Flattery, intimidation, or fake emergency deadlines preventing verification.',
      'Requests to install third-party remote desktop utilities outside official IT portals.'
    ],
    prevention: [
      'Establish a strict policy: never approve an unexpected MFA push ("MFA fatigue").',
      'Require number-matching MFA or FIDO2 security keys rather than simple Approve/Deny prompts.',
      'Hang up and dial the official internal directory number whenever an authority figure asks for favors.'
    ],
    mitigation: [
      'Alert your helpdesk/security team immediately if an MFA prompt was accidentally approved.',
      'Audit enrolled MFA devices and revoke unrecognized phone numbers or hardware tokens.',
      'Document caller ID, phone number, and pretext details to warn peers.'
    ]
  },
  {
    id: 'threat-identity-theft',
    name: 'Identity Theft & Account Takeover',
    category: 'Data & Identity',
    severity: 'High',
    summary: 'Unauthorized acquisition and abuse of personal identifiers, reused passwords, or mobile numbers (SIM swapping) to impersonate victims.',
    prevalenceShare: 7,
    overview:
      'Credential stuffing attacks automate millions of username/password pairs leaked from past breaches against banking, retail, and email portals, exploiting password reuse.',
    killChain: [
      { stage: '1. Breach Aggregation', description: 'Attackers collect leaked email/password combos from older third-party breaches.' },
      { stage: '2. Automated Stuffing', description: 'Botnets test leaked pairs across high-value financial and shopping sites.' },
      { stage: '3. SIM / Recovery Hijack', description: 'Mobile carriers are social-engineered to port the victim number to an attacker SIM.' },
      { stage: '4. Financial Fraud', description: 'Attacker resets recovery emails, opens credit lines, or drains loyalty/bank balances.' }
    ],
    warningSigns: [
      'Sudden loss of cellular signal ("SOS / No Service") indicating a possible SIM swap.',
      'Password reset emails you did not trigger or unfamiliar credit inquiry alerts.',
      'Unrecognized shipping addresses added to retail accounts.'
    ],
    prevention: [
      'Use unique, randomly generated passwords for every single website via a password manager.',
      'Add a carrier port-out PIN / Number Lock with your mobile provider and avoid SMS 2FA where possible.',
      'Place free security freezes with major credit bureaus when not actively applying for credit.'
    ],
    mitigation: [
      'Contact your mobile carrier immediately if cellular service drops unexpectedly.',
      'Lock affected financial cards, reset recovery email passwords first, then dependent accounts.',
      'File identity theft documentation and review recent account statements.'
    ]
  },
  {
    id: 'threat-ddos',
    name: 'DDoS (Distributed Denial of Service)',
    category: 'Infrastructure',
    severity: 'Elevated',
    summary: 'Coordinated floods of malicious network traffic designed to exhaust bandwidth, servers, or application APIs and knock services offline.',
    prevalenceShare: 4,
    overview:
      'DDoS attacks leverage compromised IoT devices and botnets to overwhelm volumetric network pipes or expensive application endpoints (such as search queries and login APIs), disrupting availability.',
    killChain: [
      { stage: '1. Botnet Recruitment', description: 'Thousands of poorly secured routers/IoT cameras are infected with malware.' },
      { stage: '2. Traffic Amplification', description: 'Spoofed requests bounce off misconfigured DNS/NTP servers toward target IPs.' },
      { stage: '3. Resource Exhaustion', description: 'Server CPU, connection tables, or upstream bandwidth saturate.' },
      { stage: '4. Service Outage', description: 'Legitimate users experience timeouts, dropped packets, or 503 errors.' }
    ],
    warningSigns: [
      'Sudden 10x–100x spike in inbound requests from geographically dispersed IP ranges.',
      'Repeated requests targeting uncached search, export, or authentication endpoints.',
      'Upstream firewall connection-table saturation.'
    ],
    prevention: [
      'Front public web applications with Anycast CDN and DDoS scrubbing proxies.',
      'Apply strict rate limiting, caching, and Web Application Firewall (WAF) rules on heavy endpoints.',
      'Change default credentials and isolate IoT devices on segmented guest/VLAN networks.'
    ],
    mitigation: [
      'Enable "Under Attack" edge challenge modes and geo/ASN rate limits.',
      'Hide origin server IPs behind cloud proxy layers so attackers cannot bypass the CDN.',
      'Coordinate with ISP upstream blackholing or scrubbing centers during volumetric floods.'
    ]
  },
  {
    id: 'threat-data-breach',
    name: 'Data Breaches & Cloud Misconfiguration',
    category: 'Data & Identity',
    severity: 'Critical',
    summary: 'Unauthorized exposure or exfiltration of sensitive databases, API keys, or cloud storage buckets due to misconfiguration or vulnerabilities.',
    prevalenceShare: 4,
    overview:
      'A large proportion of cloud data breaches stem not from zero-day exploits, but from publicly exposed storage buckets, hardcoded API keys in public repositories, and overly broad database permissions.',
    killChain: [
      { stage: '1. Discovery', description: 'Automated scanners find public S3 buckets, open ports, or leaked GitHub secrets.' },
      { stage: '2. Access & Enumeration', description: 'Attacker queries exposed APIs or downloads unencrypted backups.' },
      { stage: '3. Exfiltration', description: 'PII, hashed credentials, or proprietary source data are copied.' },
      { stage: '4. Exposure / Resale', description: 'Records appear on leak forums, triggering secondary phishing campaigns.' }
    ],
    warningSigns: [
      'Unusual large outbound data transfers or off-hours database read spikes.',
      'Secret scanners flagging API keys committed to version control.',
      'Third-party breach notification alerts matching your organization domain.'
    ],
    prevention: [
      'Enforce Secret Manager / environment injection—never hardcode credentials in source code.',
      'Apply zero-trust least privilege and default-deny security rules on databases and cloud buckets.',
      'Encrypt sensitive fields at rest and mask PII in logs and non-production environments.'
    ],
    mitigation: [
      'Immediately revoke and rotate any exposed API keys, certificates, or database credentials.',
      'Lock down public access controls and audit access logs to determine scope of exposure.',
      'Notify impacted users transparently with clear remediation steps.'
    ]
  }
];
