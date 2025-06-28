// Automated tag generation for publications
import fs from 'fs/promises';
import path from 'path';

// Define tag mapping rules
const TAG_RULES = {
  // Journal-based tags
  journalPatterns: {
    'Neuropsychologia': ['Neuroscience', 'Cognitive Science'],
    'Frontiers in Neuroimaging': ['Neuroimaging', 'Neuroscience'],
    'Imaging Neuroscience': ['Neuroimaging', 'Neuroscience'],
    'Biological Psychiatry': ['Neuroscience', 'Brain Imaging'],
    'Journal of Computer-Mediated Communication': ['Media Studies', 'Digital Communication'],
    'Communication Methods and Measures': ['Communication', 'Research Methods'],
    'Computers in Human Behavior': ['Human Behavior', 'Digital Media'],
    'Information, Communication & Society': ['Media Studies', 'Social Science'],
    'International Journal of Environmental Research and Public Health': ['Public Health'],
    'Journal of Medical Internet Research': ['Research Methods', 'Digital Health'],
    'Telematics and Informatics': ['Technology', 'Digital Media'],
    'bioRxiv': ['Preprint'],
    'Preprint': ['Preprint']
  },

  // Title keyword patterns
  titleKeywords: {
    'fMRI': ['fMRI', 'Neuroimaging'],
    'neuroimaging': ['Neuroimaging', 'Neuroscience'],
    'brain': ['Neuroscience', 'Brain Science'],
    'neural': ['Neuroscience'],
    'cognitive': ['Cognitive Science'],
    'social': ['Social Science'],
    'media': ['Media Studies'],
    'AI': ['Artificial Intelligence'],
    'artificial intelligence': ['Artificial Intelligence'],
    'reproducib': ['Reproducibility', 'Open Science'],
    'BIDS': ['BIDS', 'Neuroimaging', 'Data Standards'],
    'survey': ['Survey Design', 'Research Methods'],
    'schema': ['Data Standards', 'Research Methods'],
    'decision': ['Decision Making'],
    'game': ['Game Theory', 'Behavioral Science'],
    'narrative': ['Narrative Processing', 'Language'],
    'discourse': ['Discourse Analysis', 'Language'],
    'COVID': ['COVID-19', 'Public Health'],
    'obesity': ['Public Health', 'Health Communication'],
    'eating disorder': ['Mental Health', 'Health Communication'],
    'gender': ['Gender Studies'],
    'moral': ['Moral Psychology', 'Social Psychology'],
    'emotion': ['Emotion', 'Psychology'],
    'network': ['Network Analysis', 'Computational Methods'],
    'computational': ['Computational Methods'],
    'machine learning': ['Machine Learning', 'Computational Methods'],
    'natural language': ['Natural Language Processing', 'Computational Methods']
  },

  // Author-based rules (for specific research areas)
  authorPatterns: {
    'Yibei Chen': {
      // Add default tags for Yibei's work
      defaultTags: [],
      // Context-specific tags based on co-authors or journals
      contextRules: {
        'Weber': ['Media Neuroscience', 'Communication'],
        'Ghosh': ['Reproducibility', 'Open Science'],
        'Sun': ['Health Communication', 'Chinese Media']
      }
    }
  },

  // Predefined tag hierarchy to ensure consistency
  tagHierarchy: {
    'Neuroscience': {
      children: ['Cognitive Science', 'Social Neuroscience', 'Brain Science'],
      aliases: ['Neural', 'Brain Research']
    },
    'Neuroimaging': {
      children: ['fMRI', 'Brain Imaging'],
      aliases: ['Brain Imaging', 'Neural Imaging']
    },
    'Research Methods': {
      children: ['Reproducibility', 'Data Standards', 'Survey Design', 'Open Science'],
      aliases: ['Methodology', 'Methods']
    },
    'Media Studies': {
      children: ['Digital Media', 'Health Communication', 'Chinese Media'],
      aliases: ['Communication', 'Media Research']
    },
    'Computational Methods': {
      children: ['Machine Learning', 'Natural Language Processing', 'Network Analysis'],
      aliases: ['Data Science', 'Computational Analysis']
    }
  }
};

// Core tag generation functions
function generateTagsFromJournal(journal) {
  const tags = new Set();
  
  for (const [pattern, journalTags] of Object.entries(TAG_RULES.journalPatterns)) {
    if (journal && journal.toLowerCase().includes(pattern.toLowerCase())) {
      journalTags.forEach(tag => tags.add(tag));
    }
  }
  
  return Array.from(tags);
}

function generateTagsFromTitle(title) {
  const tags = new Set();
  const titleLower = title.toLowerCase();
  
  for (const [keyword, keywordTags] of Object.entries(TAG_RULES.titleKeywords)) {
    if (titleLower.includes(keyword.toLowerCase())) {
      keywordTags.forEach(tag => tags.add(tag));
    }
  }
  
  return Array.from(tags);
}

function generateTagsFromAuthors(authors) {
  const tags = new Set();
  
  // Check for specific author patterns
  for (const author of authors) {
    for (const [authorPattern, rules] of Object.entries(TAG_RULES.authorPatterns)) {
      if (author.includes(authorPattern)) {
        // Add default tags
        rules.defaultTags.forEach(tag => tags.add(tag));
        
        // Check context rules based on co-authors
        for (const [coAuthorPattern, contextTags] of Object.entries(rules.contextRules)) {
          if (authors.some(a => a.includes(coAuthorPattern))) {
            contextTags.forEach(tag => tags.add(tag));
          }
        }
      }
    }
  }
  
  return Array.from(tags);
}

function normalizeAndDeduplicateTags(tags) {
  const normalized = new Set();
  
  for (const tag of tags) {
    // Check if this tag should be replaced by a parent tag
    let finalTag = tag;
    
    for (const [parentTag, config] of Object.entries(TAG_RULES.tagHierarchy)) {
      // Check if current tag is an alias
      if (config.aliases && config.aliases.some(alias => 
        alias.toLowerCase() === tag.toLowerCase())) {
        finalTag = parentTag;
        break;
      }
      
      // Check if current tag is a child that should be promoted
      if (config.children && config.children.some(child => 
        child.toLowerCase() === tag.toLowerCase())) {
        // Keep the specific child tag, but also add parent if relevant
        normalized.add(parentTag);
      }
    }
    
    normalized.add(finalTag);
  }
  
  return Array.from(normalized);
}

function generateTagsForPublication(publication) {
  const allTags = new Set();
  
  // Generate tags from different sources
  const journalTags = generateTagsFromJournal(publication.journal);
  const titleTags = generateTagsFromTitle(publication.title);
  const authorTags = generateTagsFromAuthors(publication.authors || []);
  
  // Combine all tags
  [...journalTags, ...titleTags, ...authorTags].forEach(tag => allTags.add(tag));
  
  // Keep existing manual tags if they exist
  if (publication.tags) {
    publication.tags.forEach(tag => allTags.add(tag));
  }
  
  // Normalize and deduplicate
  return normalizeAndDeduplicateTags(Array.from(allTags));
}

async function updatePublicationsWithTags() {
  try {
    const publicationsPath = path.join(process.cwd(), 'src/data/publications.json');
    const publicationsData = JSON.parse(await fs.readFile(publicationsPath, 'utf8'));
    
    // Generate tags for each publication
    const updatedPublications = publicationsData.map(pub => ({
      ...pub,
      tags: generateTagsForPublication(pub)
    }));
    
    // Create backup
    const backupPath = path.join(process.cwd(), `src/data/publications.backup.${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(publicationsData, null, 2));
    console.log(`Backup created: ${backupPath}`);
    
    // Write updated publications
    await fs.writeFile(publicationsPath, JSON.stringify(updatedPublications, null, 2));
    
    // Generate tag statistics
    const allTags = new Set();
    updatedPublications.forEach(pub => {
      pub.tags.forEach(tag => allTags.add(tag));
    });
    
    console.log(`Successfully updated ${updatedPublications.length} publications`);
    console.log(`Generated ${allTags.size} unique tags:`, Array.from(allTags).sort());
    
    return updatedPublications;
  } catch (error) {
    console.error('Error updating publications with tags:', error);
    throw error;
  }
}

// Export functions for use in other scripts
export {
  generateTagsForPublication,
  updatePublicationsWithTags,
  TAG_RULES
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePublicationsWithTags();
}