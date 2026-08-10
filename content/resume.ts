/**
 * Single source of truth for resume facts (AGENTS.md rule 2).
 * Update this file — never hardcode facts in components.
 */

export const education = {
  school: "University of Pittsburgh",
  units: "Swanson School of Engineering · David C. Frederick Honors College",
  degree: "BS in Computer Engineering, Honors Degree",
  graduation: "April 2027",
  minor: "Minor in Economics",
  gpa: "3.91 / 4.0",
  coursework: [
    "Cyber-Physical Systems",
    "Embedded Systems",
    "ECE Project Systems Engineering",
  ],
  abroad: [
    { code: "KR", place: "South Korea", year: "2024", href: "https://pittplus3.blog/tag/Matthew-Ketas/" },
    {
      code: "CZ",
      place: "Czech Republic",
      year: "2025",
      href: "https://swansonglobalengineers.com/?tag=matthew-k%2Bczech-republic",
    },
    {
      code: "BR",
      place: "Brazil",
      year: "2026",
      href: "https://swansonglobalengineers.com/?tag=matthew-k%2Benergy-brazil",
    },
  ],
} as const;

export type Job = {
  refdes: string;
  company: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    refdes: "U1",
    company: "Aerotech, Inc.",
    role: "Software Engineering Intern — Application Development",
    location: "Pittsburgh, PA",
    dates: "May 2025 – Aug 2025",
    bullets: [
      "Developed the C Transformations module for the 2.11.0 release of the Automation1 application in C#/.NET using MVVM.",
      "Implemented a new operational mode for an internal hardware tester to set flash parameters on-site after verification.",
      "Verified and validated Automation1 features and resolved defects during release testing.",
    ],
    stack: ["C#", ".NET", "XAML", "MVVM", "Jira"],
  },
  {
    refdes: "U2",
    company: "Own Company (acquired by Salesforce)",
    role: "Software Engineering Intern — Platform",
    location: "Englewood Cliffs, NJ",
    dates: "Jun 2024 – Aug 2024",
    bullets: [
      "Implemented a page object model and 30+ end-to-end tests for the product platform using Playwright for TypeScript.",
      "Built an online experiment procedure that removed experimenter involvement, cutting bias and saving two hours and $200 per experiment.",
    ],
    stack: ["TypeScript", "Playwright", "E2E Testing"],
  },
  {
    refdes: "U3",
    company: "Own Company (formerly OwnBackup)",
    role: "Corporate Development Intern",
    location: "Englewood Cliffs, NJ",
    dates: "Sep 2022 – May 2023",
    bullets: [
      "Analyzed data and generated reports to support strategic decisions.",
      "Bridged product development and marketing teams, and maintained relationships with prospective partners.",
    ],
    stack: ["Data Analysis", "Reporting"],
  },
];

export type Project = {
  refdes: string;
  name: string;
  role: string;
  dates: string;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    refdes: "J1",
    name: "HearSmart Hearing Aid",
    role: "Assistant Researcher · University of Pittsburgh",
    dates: "Sep 2024 – Apr 2025",
    summary:
      "Closed-loop, auto-focusing hearing aid research: neural signals in, audio focus out.",
    bullets: [
      "Architected a Python-based real-time data acquisition pipeline coordinating streams from multiple hardware inputs.",
      "Interfaced patient-worn EEG hardware via the PYGDS library, processing neural signal data to drive closed-loop audio-focus adjustment algorithms.",
    ],
    stack: ["Python", "EEG", "PYGDS", "Signal Processing"],
  },
  {
    refdes: "J2",
    name: "SaveIt!",
    role: "Enclosure & Embedded Software Engineer · University of Pittsburgh",
    dates: "Sep 2024 – Apr 2025",
    summary:
      "An AED-style CPR training device: sensors, firmware, enclosure, and PCB.",
    bullets: [
      "Designed the AED-like enclosure and connected the CPR manikin to ESP32s over Bluetooth.",
      "Generated the bill of materials, wrote GPIO code for each sensor, and assisted PCB design and verification in Altium.",
    ],
    stack: ["ESP32", "C", "Bluetooth", "Altium", "Fusion360"],
  },
];

export const leadership = [
  {
    org: "IEEE — University of Pittsburgh Student Branch",
    role: "Vice President (former Activities Chair)",
    dates: "Aug 2023 – Present",
    line: "Grew event attendance 100%+, coordinated industry partnerships with Hitachi and Aerotech, restructured the chapter constitution, and launched the chapter website.",
  },
  {
    org: "Triangle Fraternity (STEM)",
    role: "VP of Recruitment & Wellness Chair (former Secretary)",
    dates: "Mar 2024 – Present",
    line: "Ran a full year of recruitment welcoming new engineers and scientists, and coordinated executive-board efforts across philanthropy, professional, and academic events.",
  },
] as const;

export const skills = {
  languages: ["C", "C#", "Python", "TypeScript", "RISC-V", "ARM Assembly", "VHDL", "XAML"],
  tools: [".NET", "Playwright", "PlatformIO", "Altium", "Fusion360", "Jira", "GitHub", "GitLab", "Prism"],
} as const;
