export const researchAreas = [
  {
    id: "neuroimaging",
    title: "Neuroimaging & Brain Science",
    description: "My research uses advanced neuroimaging techniques to understand how the brain processes information during natural, real-world experiences. Using fMRI and sophisticated computational methods, I investigate neural responses during activities like watching videos, engaging in conversations, and playing games. This work bridges cognitive neuroscience with real-world behavior, revealing how our brains adapt to and interpret complex, dynamic environments. By studying brain activity during these naturalistic tasks, we gain insights into the neural mechanisms underlying human perception, decision-making, and social interaction.",
    projects: [
      {
        title: "Brain State Dynamics in Narrative Comprehension",
        description: "Using advanced fMRI analysis and computational methods to investigate how brain states dynamically shift during narrative processing. This work reveals how contextual factors modulate neural responses and behavioral outcomes during natural language comprehension.",
        image: "https://www.biorxiv.org/content/biorxiv/early/2025/04/06/2025.04.05.647323/F2.large.jpg?width=800&height=600&carousel=1",
        paper: "https://doi.org/10.1101/2025.04.05.647323",
        code: "https://github.com/yibeichan/prettymouth",
        tags: ["Brain States", "fMRI", "Narrative"]
      },
      {
        title: "Neural Basis of Social Decision-Making",
        description: "Investigating how the brain processes probability versus belief during social decision-making in a card game context. This study reveals the neural mechanisms underlying how we integrate mathematical probability with social beliefs about opponents when making decisions.",
        image: "https://ars.els-cdn.com/content/image/1-s2.0-S0028393223001690-gr1.jpg",
        paper: "https://doi.org/10.1016/j.neuropsychologia.2023.108635",
        code: "https://github.com/yibeichan/card-game-neuro",
        tags: ["Decision Making", "Game Theory", "Social Neuroscience"]
      }
    ]
  },
  {
    id: "reproducibility",
    title: "Research Methods & Reproducibility",
    description: "My work in research methods focuses on developing robust frameworks and tools that enhance scientific reproducibility. Through projects like ReproSchema and BIDS Apps, I create standardized approaches for data collection, analysis, and sharing across scientific disciplines. This research addresses critical challenges in methodology standardization while maintaining flexibility for diverse research needs. By emphasizing open-source development and community-driven standards, we're building infrastructure that makes scientific research more transparent, reliable, and accessible to researchers worldwide.",
    projects: [
      {
        title: "ReproSchema Framework",
        description: "Leading the development of ReproSchema, a comprehensive framework that standardizes survey data collection across research domains. This tool introduces machine-readable schemas, automated validation, and multilingual support, making research more reproducible and interoperable. The framework addresses critical challenges in data standardization while maintaining flexibility for diverse research needs.",
        image: "https://www.repronim.org/reproschema/img/reproschema_logo.png",
        paper: "https://doi.org/10.2196/63343",
        code: "https://github.com/ReproNim/reproschema",
        tags: ["Reproducibility", "Methods", "Surveys"]
      },
      {
        title: "BIDS App Bootstrap (BABS)",
        description: "Contributing to the development of BIDS Apps, a containerized ecosystem for neuroimaging analysis. This project combines the Brain Imaging Data Structure (BIDS) with reproducible computing principles to enable automated processing of large-scale datasets. The system streamlines complex neuroimaging workflows while ensuring computational reproducibility across institutions.",
        image: "https://raw.githubusercontent.com/PennLINC/babs/main/docs/_static/babs_cli.png",
        paper: "https://doi.org/10.1162/imag_a_00074",
        code: "https://github.com/PennLINC/babs",
        tags: ["BIDS", "Neuroimaging", "Workflows"]
      }
    ]
  },
  {
    id: "computational-social",
    title: "Computational Social Science",
    description: "In computational social science, I apply advanced data analysis and machine learning techniques to understand human behavior and social interactions in digital spaces. My research examines how people communicate, make decisions, and form opinions in online environments. Using computational methods ranging from natural language processing to network analysis, I investigate patterns in social media discourse, digital media representation, and online information flow. This work provides insights into how digital technologies shape social dynamics and human behavior at scale.",
    projects: [
      {
        title: "Moral and Emotional Discourse Analysis",
        description: "Investigating how moral reasoning and emotional expression manifest in social media discourse through detailed case studies. Using computational methods and discourse analysis, we examine how users engage with morally charged topics, revealing patterns in online moral reasoning and emotional expression that reflect broader social dynamics.",
        image: "https://www.tandfonline.com/cms/asset/1ece73ab-eebf-40df-9b90-f92bcb94b7bc/rics_a_2246551_f0002_oc.jpg",
        paper: "https://doi.org/10.1080/1369118X.2023.2246551",
        tags: ["Social Media", "Discourse Analysis", "Moral Psychology"]
      },
      {
        title: "Gender Representation in Digital Media",
        description: "Examining how gender is represented across digital spaces through AI-generated and human-curated news imagery. This research combines computer vision analysis with social science frameworks to understand how gender stereotypes persist and evolve in visual news content, revealing systemic patterns in media representation.",
        image: "https://mfr.osf.io/export?url=https://osf.io/download/c97qm/?view_only=cd1d797a3c794e21acc208e842d39d61%26direct=%26mode=render&format=2400x2400.jpeg",
        paper: "https://doi.org/10.1093/jcmc/zmad047",
        code: "https://osf.io/dsajb/?view_only=cd1d797a3c794e21acc208e842d39d61",
        tags: ["AI", "Gender Studies", "News Media"]
      }
    ]
  }
];