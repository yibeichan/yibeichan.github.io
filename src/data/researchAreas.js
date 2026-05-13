export const researchAreas = [
  {
    id: "neuroimaging",
    title: "Neuroimaging & Brain Science",
    description: "How does the brain process natural, real-world experiences? Using fMRI and computational methods, I study neural dynamics during activities like watching movies, playing games, and having conversations — bridging cognitive neuroscience with real-world behavior.",
    projects: [
      {
        title: "Brain State Dynamics in Narrative Comprehension",
        description: "How do brain states shift during narrative processing? Using fMRI and computational modeling, we showed that contextual factors modulate neural dynamics and behavioral responses during natural language comprehension. Published in Imaging Neuroscience.",
        image: "https://www.biorxiv.org/content/biorxiv/early/2025/04/06/2025.04.05.647323/F2.large.jpg?width=800&height=600&carousel=1",
        paper: "https://doi.org/10.1162/IMAG.a.1116",
        code: "https://github.com/yibeichan/prettymouth",
        tags: ["Brain States", "fMRI", "Narrative"]
      },
      {
        title: "Neural Basis of Social Decision-Making",
        description: "How does the brain integrate probability versus belief during social decisions? In a card game paradigm, we identified the neural mechanisms underlying how mathematical probability competes with social beliefs about opponents.",
        image: "https://ars.els-cdn.com/content/image/1-s2.0-S0028393223001690-gr1.jpg",
        paper: "https://doi.org/10.1016/j.neuropsychologia.2023.108635",
        code: "https://github.com/yibeichan/card-game-neuro",
        tags: ["Decision Making", "Game Theory", "Social Neuroscience"]
      },
      {
        title: "Visual Feature Encoding in Autism",
        description: "Preregistered movie-fMRI analyses revealing altered visual feature encoding in the posterior superior temporal sulcus (pSTS) in autism, using naturalistic movie-watching paradigms.",
        image: "https://www.biorxiv.org/content/biorxiv/early/2025/04/06/2025.04.05.647323/F2.large.jpg?width=800&height=600&carousel=1",
        paper: "https://doi.org/10.64898/2026.03.23.713749",
        tags: ["Autism", "Naturalistic fMRI", "Visual Processing"]
      }
    ]
  },
  {
    id: "reproducibility",
    title: "Research Methods & Reproducibility",
    description: "Good science needs good infrastructure. I build open-source tools that standardize data collection, analysis, and sharing — making research more transparent and reproducible across labs and disciplines.",
    projects: [
      {
        title: "ReproSchema Framework",
        description: "A machine-readable schema for standardizing survey data collection across research domains. Includes automated validation, multilingual support, and interoperability with existing tools. Published in JMIR.",
        image: "https://www.repronim.org/reproschema/img/reproschema_logo.png",
        paper: "https://doi.org/10.2196/63343",
        code: "https://github.com/ReproNim/reproschema",
        tags: ["Reproducibility", "Methods", "Open Source"]
      },
      {
        title: "BIDS App Bootstrap (BABS)",
        description: "Containerized neuroimaging analysis at scale. BABS combines the Brain Imaging Data Structure with reproducible computing principles to enable automated processing of large datasets across institutions.",
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
    description: "Applying computational methods to understand human behavior in digital spaces — from moral discourse on social media to gender representation in AI-generated news imagery.",
    projects: [
      {
        title: "Moral and Emotional Discourse on Social Media",
        description: "How do moral reasoning and emotional expression manifest online? Using computational methods and discourse analysis across case studies, we revealed patterns in online moral reasoning that reflect broader social dynamics.",
        image: "https://www.tandfonline.com/cms/asset/1ece73ab-eebf-40df-9b90-f92bcb94b7bc/rics_a_2246551_f0002_oc.jpg",
        paper: "https://doi.org/10.1080/1369118X.2023.2246551",
        tags: ["Social Media", "Moral Psychology"]
      },
      {
        title: "Gender Representation in AI-Generated Media",
        description: "How does AI shape visual gender stereotypes? Combining computer vision with social science frameworks, we examined gender representation across AI-generated and human-curated news imagery.",
        image: "https://mfr.osf.io/export?url=https://osf.io/download/c97qm/?view_only=cd1d797a3c794e21acc208e842d39d61%26direct=%26mode=render&format=2400x2400.jpeg",
        paper: "https://doi.org/10.1093/jcmc/zmad047",
        code: "https://osf.io/dsajb/?view_only=cd1d797a3c794e21acc208e842d39d61",
        tags: ["AI", "Gender Studies", "Media"]
      }
    ]
  }
];