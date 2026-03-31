const CmsContent = require('../models/CmsContent');

// 1. Get all content for frontend
exports.getContent = async (req, res) => {
  try {
    const data = await CmsContent.findOne().sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ message: "No content found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Update content (Universal)
exports.updateContent = async (req, res) => {
  try {
    const updateData = req.body;
    let data = await CmsContent.findOne().sort({ createdAt: -1 });
    
    if (!data) {
      data = new CmsContent(updateData);
    } else {
      Object.assign(data, updateData);
    }

    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Seed initial content (From siteContent.js snapshot)
exports.seedContent = async (req, res) => {
  try {
    const initialData = {
      siteProfile: {
        name: 'Kushal Sai Aleti',
        tagline: 'MERN developer building crisp, scalable web experiences.',
        subtitle: 'React, Node.js, product-focused UI/UX, AI-assisted workflows.',
        email: 'kushalsaialeti98@gmail.com',
        phone: '+91 9493363446',
        github: 'https://github.com/kushalsaialeti',
        linkedin: 'https://www.linkedin.com/in/kushalsaialeti/',
        instagram: 'https://www.instagram.com/_.kushal._.sai._.aleti._/',
        resume: 'https://drive.google.com/file/d/1IFhyy4t86A0wb_swCsI4bDfE_hN38FNb/view?usp=drive_link',
      },
      siteSections: [
        { id: 'home', navLabel: 'Home', title: '', eyebrow: 'Welcome', panelInfo: '', order: 0 },
        { id: 'about', navLabel: 'About', title: 'About', eyebrow: 'Who I Am', panelInfo: 'My background...', order: 1 },
        { id: 'skills', navLabel: 'Skills', title: 'Skills', eyebrow: 'Stack', panelInfo: 'Frontend, backend...', order: 2 },
        { id: 'projects', navLabel: 'Projects', title: 'Projects', eyebrow: 'Work', panelInfo: 'Selected projects...', order: 3 },
        { id: 'activities', navLabel: 'Activities', title: 'Activities', eyebrow: 'Community', panelInfo: 'Leadership...', order: 4 },
        { id: 'blogs', navLabel: 'Blogs', title: 'Blogs', eyebrow: 'Insights', panelInfo: 'Technical articles...', order: 5 },
        { id: 'contact', navLabel: 'Contact', title: 'Contact', eyebrow: 'Reach Out', panelInfo: 'Email, phone...', order: 6 },
      ],
      blogs: [
        { title: 'Architecting Scalable MERN Apps', date: 'March 24, 2026', snippet: 'Strategies for managing...', link: '#' },
        { title: 'The Future of Vibe Coding', date: 'Feb 12, 2026', snippet: 'Exploring how AI...', link: '#' },
        { title: 'Civic Pulse: Engineering for Social Impact', date: 'Jan 05, 2026', snippet: 'A deep dive into...', link: '#' }
      ],
      aboutLines: [
        "I am a results-driven MERN stack developer...",
        "From architecting scalable server-side systems...",
        "Beyond simple implementation...",
        "I am an active community contributor...",
        "My design philosophy...",
        "Whether it is optimizing complex queries...",
        "I thrive in fast-paced environments..."
      ],
      skills: {
        frontend: ['React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
        backend: ['Node.js', 'Express.js', 'FastAPI', 'Flask'],
        databases: ['MongoDB', 'PostgreSQL', 'Supabase'],
        tools: ['Git', 'GitHub', 'Postman', 'Docker', 'Vercel', 'n8n', 'Copilot'],
        languages: ['JavaScript', 'Python', 'Java', 'C'],
      },
      projects: [
        { name: 'Navya Sree Embroidery', description: 'E-commerce focused...', stack: ['Next.js', 'React'], live: 'https://navya-sree-embroidery.vercel.app/' },
        { name: 'Civic Pulse', description: 'Location-aware civic app...', stack: ['React', 'Geo APIs'], live: '#' },
      ],
      activities: [
        'Art of Living Volunteer (2023–Present)',
        'GDG On-Campus SRKR PR Team (2024–25)',
        'Organizer - GDG Dev Challenge 2025',
        'Member - PAIE CELL SRKR',
      ]
    };

    const data = new CmsContent(initialData);
    await data.save();
    res.json({ message: "Content seeded successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
