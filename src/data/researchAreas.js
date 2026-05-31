export const researchAreas = [
  {
    id: "neuroimaging",
    title: "Neuroimaging & Brain Science",
    description:
      "How does the brain process natural, real-world experiences? Using fMRI and computational methods, I study neural dynamics during activities like watching movies, playing games, and having conversations — bridging cognitive neuroscience with real-world behavior.",
    projects: [
      {
        id: "prettymouth",
        title: "Brain State Dynamics in Narrative Comprehension",
        oneliner:
          "How context shapes the brain's state trajectory during a story — and how the code keeps running after publication.",
        description:
          "How do brain states shift during narrative processing? Using fMRI and computational modeling, we showed that contextual factors modulate neural dynamics and behavioral responses during natural language comprehension.",
        image:
          "https://www.biorxiv.org/content/biorxiv/early/2025/04/06/2025.04.05.647323/F2.large.jpg?width=800&height=600&carousel=1",
        status: "live",
        lastUpdated: "2025-12",
        tags: ["Brain States", "fMRI", "Narrative"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.1162/IMAG.a.1116",
            label: "Imaging Neuroscience (2026)",
          },
          code: {
            url: "https://github.com/yibeichan/prettymouth",
            label: "GitHub — v1.0-published",
          },
          data: {
            url: "https://osf.io/7aqth/",
            label: "OSF — Derived outputs (6.3 GB)",
          },
          docs: {
            url: "https://github.com/yibeichan/prettymouth/tree/main/docs",
            label: "Methodological Notes",
          },
          agents: {
            url: "https://github.com/yibeichan/prettymouth/blob/main/AGENTS.md",
            label: "AI Agent Guide",
          },
        },
        highlight: true,
      },
      {
        id: "card-game",
        title: "Neural Basis of Social Decision-Making",
        oneliner:
          "Probability vs. belief — how the brain computes social decisions under ambiguity.",
        description:
          "How does the brain integrate probability versus belief during social decisions? In a card game paradigm, we identified the neural mechanisms underlying how mathematical probability competes with social beliefs about opponents.",
        image:
          "https://ars.els-cdn.com/content/image/1-s2.0-S0028393223001690-gr1.jpg",
        status: "published",
        tags: ["Decision Making", "Game Theory", "Social Neuroscience"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.1016/j.neuropsychologia.2023.108635",
            label: "Neuropsychologia (2023)",
          },
          code: {
            url: "https://github.com/yibeichan/card-game-neuro",
            label: "GitHub",
          },
        },
        highlight: false,
      },
      {
        id: "autism-psts",
        title: "Visual Feature Encoding in Autism",
        oneliner:
          "Altered sensory processing in autism revealed through naturalistic movie fMRI.",
        description:
          "Preregistered movie-fMRI analyses revealing altered visual feature encoding in the posterior superior temporal sulcus (pSTS) in autism, using naturalistic movie-watching paradigms.",
        image:
          "https://www.biorxiv.org/content/biorxiv/early/2025/04/06/2025.04.05.647323/F2.large.jpg?width=800&height=600&carousel=1",
        status: "live",
        tags: ["Autism", "Naturalistic fMRI", "Visual Processing"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.64898/2026.03.23.713749",
            label: "Preprint (2026)",
          },
        },
        highlight: false,
      },
    ],
  },
  {
    id: "reproducibility",
    title: "Research Methods & Reproducibility",
    description:
      "Good science needs good infrastructure. I build open-source tools that standardize data collection, analysis, and sharing — making research more transparent and reproducible across labs and disciplines.",
    projects: [
      {
        id: "reproschema",
        title: "ReproSchema Framework",
        oneliner:
          "Machine-readable survey schemas that travel from data collection to analysis without loss.",
        description:
          "A machine-readable schema for standardizing survey data collection across research domains. Includes automated validation, multilingual support, and interoperability with existing tools.",
        image:
          "https://www.repronim.org/reproschema/img/reproschema_logo.png",
        status: "live",
        lastUpdated: "2025-06",
        tags: ["Reproducibility", "Methods", "Open Source"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.2196/63343",
            label: "JMIR (2025)",
          },
          code: {
            url: "https://github.com/ReproNim/reproschema",
            label: "GitHub — Repronim",
          },
          docs: {
            url: "https://www.repronim.org/reproschema/",
            label: "Documentation",
          },
        },
        highlight: false,
      },
      {
        id: "babs",
        title: "BIDS App Bootstrap (BABS)",
        oneliner:
          "Containerized neuroimaging at scale — from one subject to a thousand.",
        description:
          "Containerized neuroimaging analysis at scale. BABS combines the Brain Imaging Data Structure with reproducible computing principles to enable automated processing of large datasets across institutions.",
        image:
          "https://raw.githubusercontent.com/PennLINC/babs/main/docs/_static/babs_cli.png",
        status: "published",
        tags: ["BIDS", "Neuroimaging", "Workflows"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.1162/imag_a_00074",
            label: "Imaging Neuroscience (2024)",
          },
          code: {
            url: "https://github.com/PennLINC/babs",
            label: "GitHub — PennLINC",
          },
        },
        highlight: false,
      },
    ],
  },
  {
    id: "computational-social",
    title: "Computational Social Science",
    description:
      "Applying computational methods to understand human behavior in digital spaces — from moral discourse on social media to gender representation in AI-generated news imagery.",
    projects: [
      {
        id: "moral-discourse",
        title: "Moral and Emotional Discourse on Social Media",
        oneliner:
          "What online moral reasoning reveals about how society argues with itself.",
        description:
          "How do moral reasoning and emotional expression manifest online? Using computational methods and discourse analysis across case studies, we revealed patterns in online moral reasoning that reflect broader social dynamics.",
        image:
          "https://www.tandfonline.com/cms/asset/1ece73ab-eebf-40df-9b90-f92bcb94b7bc/rics_a_2246551_f0002_oc.jpg",
        status: "published",
        tags: ["Social Media", "Moral Psychology"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.1080/1369118X.2023.2246551",
            label: "Information, Communication & Society (2023)",
          },
        },
        highlight: false,
      },
      {
        id: "ai-gender",
        title: "Gender Representation in AI-Generated Media",
        oneliner:
          "Do AI image generators reinforce visual gender stereotypes more than human curators?",
        description:
          "How does AI shape visual gender stereotypes? Combining computer vision with social science frameworks, we examined gender representation across AI-generated and human-curated news imagery.",
        image:
          "https://mfr.osf.io/export?url=https://osf.io/download/c97qm/?view_only=cd1d797a3c794e21acc208e842d39d61%26direct=%26mode=render&format=2400x2400.jpeg",
        status: "published",
        tags: ["AI", "Gender Studies", "Media"],
        artifacts: {
          paper: {
            url: "https://doi.org/10.1093/jcmc/zmad047",
            label: "Journal of Computer-Mediated Communication (2024)",
          },
          data: {
            url: "https://osf.io/dsajb/?view_only=cd1d797a3c794e21acc208e842d39d61",
            label: "OSF — Materials & Data",
          },
        },
        highlight: false,
      },
    ],
  },
];

export const statusConfig = {
  live: {
    label: "Live",
    color: "bg-green-100 text-green-800",
    dot: "bg-green-500",
    description: "Actively maintained — code, data, and docs all available",
  },
  published: {
    label: "Published",
    color: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
    description: "Paper published; resources may be archived",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    dot: "bg-blue-400",
    description: "Ongoing work — analysis, writing, or data collection in progress",
  },
};
