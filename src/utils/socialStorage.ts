export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
  order: number;
}

const STORAGE_KEY = 'social_links';

export const getSocialLinks = (): SocialLink[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const links = JSON.parse(stored);
      return Array.isArray(links) ? links : [];
    }
    // Si no hay datos guardados, retornar array vacío
    return [];
  } catch (error) {
    console.error('Error loading social links:', error);
    return [];
  }
};

export const saveSocialLinks = (links: SocialLink[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event('socialLinksUpdated'));
  } catch (error) {
    console.error('Error saving social links:', error);
  }
};

export const updateSocialLink = (id: string, updates: Partial<SocialLink>): void => {
  const links = getSocialLinks();
  const linkIndex = links.findIndex(link => link.id === id);
  
  if (linkIndex !== -1) {
    links[linkIndex] = { ...links[linkIndex], ...updates };
    saveSocialLinks(links);
  }
};

export const addSocialLink = (link: Omit<SocialLink, 'id'>): void => {
  const links = getSocialLinks();
  const newId = Date.now().toString();
  const newLink: SocialLink = {
    ...link,
    id: newId
  };
  
  links.push(newLink);
  saveSocialLinks(links);
};

export const deleteSocialLink = (id: string): void => {
  const links = getSocialLinks();
  const filteredLinks = links.filter(link => link.id !== id);
  saveSocialLinks(filteredLinks);
};

export const getActiveSocialLinks = (): SocialLink[] => {
  return getSocialLinks()
    .filter(link => link.isActive)
    .sort((a, b) => a.order - b.order);
};
