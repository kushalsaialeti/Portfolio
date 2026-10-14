export const CORE_SECTION_IDS = ['home', 'about', 'projects', 'skills', 'contact'];
export const SECTION_SLUGS = [...CORE_SECTION_IDS, 'layout'];

export function buildCmsData(sections) {
  const siteSections = (sections.layout?.siteSections || [])
    .filter((section) => CORE_SECTION_IDS.includes(section.id));

  return {
    siteProfile: sections.home?.profile || {},
    siteSections,
    aboutLines: sections.about?.aboutLines || [],
    gallery: sections.home?.gallery || [],
    skills: sections.skills?.skills || {},
    projects: sections.projects?.projects || [],
    contact: sections.contact || {},
  };
}
