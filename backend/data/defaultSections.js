const siteProfile = {
  name: 'Kushal Sai Aleti',
  tagline: 'MERN developer building crisp, scalable web experiences.',
  subtitle: 'React, Node.js, product-focused UI/UX, AI-assisted workflows.',
  email: 'kushalsaialeti98@gmail.com',
  phone: '+91 9493363446',
  github: 'https://github.com/kushalsaialeti',
  linkedin: 'https://www.linkedin.com/in/kushalsaialeti/',
  instagram: 'https://www.instagram.com/_.kushal._.sai._.aleti._/',
  resume: 'https://drive.google.com/file/d/1IFhyy4t86A0wb_swCsI4bDfE_hN38FNb/view?usp=drive_link',
  stackLabels: ['MERN', 'REACT NATIVE', 'VIBE CODING'],
  statusWords: ['WORK', 'COLLABORATE'],
  location: {
    title: 'Current Location',
    text: 'Bhimavaram, SRKR campus',
    description: 'Engineering at SRKR Campus, Bhimavaram.',
    query: 'SRKR Engineering College, Bhimavaram',
  },
};

const siteSections = [
  { id: 'home', navLabel: 'Home', title: '', eyebrow: 'Welcome', panelInfo: '', isVisible: true },
  { id: 'about', navLabel: 'About', title: 'About', eyebrow: 'Who I Am', panelInfo: 'My background, mindset and product approach.', isVisible: true },
  { id: 'projects', navLabel: 'Projects', title: 'Projects', eyebrow: 'Work', panelInfo: 'Selected projects with stack and live links.', isVisible: true },
  { id: 'skills', navLabel: 'Skills', title: 'Skills', eyebrow: 'Stack', panelInfo: 'Frontend, backend and tools I work with.', isVisible: true },
  { id: 'contact', navLabel: 'Contact', title: 'Contact', eyebrow: 'Reach Out', panelInfo: 'Email, phone and social profiles to connect.', isVisible: true },
];

const aboutLines = [
  "I am a results-driven MERN stack developer with a deep passion for building robust, user-centric web applications.",
  "From architecting scalable server-side systems with Node.js and Express to crafting fluid, responsive frontends in React and Next.js, I focus on technical precision and visual clarity.",
  "I approach every project with a product mindset, balancing technical feasibility with practical outcomes and empathy for the end user's experience.",
];

const skills = {
  frontend: ['React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  backend: ['Node.js', 'Express.js', 'FastAPI'],
  databases: ['MongoDB', 'PostgreSQL', 'Supabase'],
  tools: ['Git', 'GitHub', 'Postman', 'Vercel'],
  languages: ['JavaScript', 'Python', 'Java', 'C'],
};

const projects = [
  {
    name: 'Navya Sree Embroidery',
    description: 'E-commerce focused Next.js experience with polished product presentation and smooth interactions.',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    live: 'https://navya-sree-embroidery.vercel.app/',
  },
  {
    name: 'Civic Pulse',
    description: 'Location-aware civic support app with camera input, AI summaries, and voice-driven interactions.',
    stack: ['React', 'Geo APIs', 'AI APIs'],
    live: '#',
  },
];

const contact = {
  introTitle: 'Contact Info',
  introText: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
  formTitle: 'Send a Message',
  submitLabel: 'Send Message',
  successMessage: 'Message sent successfully!',
  errorMessage: 'Failed to send message. Please try again.',
  placeholders: {
    name: 'Your Name',
    email: 'Your Email',
    subject: 'Brief Subject',
    message: 'Tell me more about your project...',
  },
};

const defaultSections = {
  home: { profile: siteProfile, gallery: [] },
  layout: { siteSections },
  about: { aboutLines },
  projects: { projects },
  skills: { skills },
  contact,
};

module.exports = {
  defaultSections,
  coreSectionIds: ['home', 'about', 'projects', 'skills', 'contact'],
};
