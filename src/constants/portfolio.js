import { 
  FolderIcon, 
  Terminal, 
  Activity, 
  FileText, 
  Globe, 
  Camera, 
  Mail,
  User,
  Cpu,
  History,
  GraduationCap,
  Code2,
  Image as ImageIcon,
  MessageCircle,
} from 'lucide-react';

export const PORTFOLIO_DATA = [
  {
    id: 'about',
    title: 'About',
    label: 'ABOUT ME',
    icon: FolderIcon,
    content: "MERN developer focused on scalable systems, UX clarity, and AI-assisted workflows.",
    type: 'finder'
  },
  {
    id: 'skills',
    title: 'Skills',
    label: 'SKILLS',
    icon: Terminal,
    content: {
      frontend: ["HTML", "CSS", "React.js", "Next.js", "Shadcn UI", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "FastAPI", "Flask"],
      databases: ["MongoDB", "PostgreSQL", "Supabase"],
      tools: ["Git", "GitHub", "Postman", "Vercel", "Stitch", "Copilot", "n8n", "Docker"],
      languages: ["C", "Java", "Python", "JavaScript"]
    },
    type: 'terminal'
  },
  {
    id: 'experience',
    title: 'Experience',
    label: 'EXPERIENCE',
    icon: Code2,
    content: [
      {
        company: "Vashatkara Pvt Ltd (PropConnect)",
        role: "Internship",
        description: "React Native mobile app, Secure auth & authorization, Rate limiting (API optimization), User-friendly UI/UX."
      }
    ],
    type: 'monitor'
  },
  {
    id: 'education',
    title: 'Education',
    label: 'EDUCATION',
    icon: GraduationCap,
    content: [
      {
        icon: GraduationCap,
        degree: "B.Tech CSE (2023–Present)",
        institution: "SRKR Engineering College",
        grade: "CGPA: 8.22"
      },
      {
        degree: "Intermediate (2021–2023)",
        institution: "Tirumala Jr College",
        grade: "97%, MPC"
      },
      {
        degree: "Secondary (2020–2021)",
        institution: "St. Ann’s EM School",
        grade: "GPA: 9.8"
      }
    ],
    type: 'notes'
  },
  {
    id: 'projects',
    title: 'Projects',
    label: 'PROJECTS',
    icon: Globe,
    content: [
      {
        name: "Navya Sree Embroidery",
        url: "https://navya-sree-embroidery.vercel.app/",
        tech: "Next.js platform"
      },
      {
        name: "Civic Pulse",
        description: "Geo-location + camera + AI summary + voice input app."
      }
    ],
    type: 'safari'
  },
  {
    id: 'activities',
    title: 'Activities',
    label: 'ACTIVITIES',
    icon: ImageIcon,
    content: [
      "Art of Living Volunteer (2023–Present)",
      "GDG On-Campus SRKR PR Team (2024–25)",
      "Organizer GDG Dev Challenge’25",
      "Member PAIE CELL SRKR"
    ],
    type: 'photos'
  },
  {
    id: 'contact',
    title: 'Contact',
    label: 'CONTACT',
    icon: MessageCircle,
    content: {
      phone: "+91 9493363446",
      email: "kushalsaialeti98@gmail.com",
      links: [
        { name: "LinkedIn", href: "/in/kushalsaialeti/" },
        { name: "GitHub", href: "/kushalsaialeti" },
        { name: "Instagram", href: "/_.kushal._.sai._.aleti._/" }
      ]
    },
    type: 'mail'
  }
];
