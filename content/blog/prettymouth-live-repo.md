---
title: "Publishing is the start, not the end"
description: "How we built a research artifact that stays alive after publication — the PrettyMouth repo as a case study."
date: "2026-05-30"
tags: ["reproducibility", "open-source", "prettymouth"]
---

# Publishing is the start, not the end

The paper is published. You get the acceptance email. You update your CV. Then what?

For most research projects, this is the end. The code sits in a GitHub repo nobody visits. The data lives on a lab server that gets wiped when a postdoc leaves. The paper itself is behind a paywall, locked at a single snapshot.

This isn't anyone's fault. There's no incentive structure for what happens *after* publication. The system rewards the acceptance letter, not what you leave behind.

For PrettyMouth, we tried something different.

## The paper

PrettyMouth is a study about how context changes the way brains process stories. Two groups of listeners heard the same audio recording, preceded by different framing paragraphs. We fit Hidden Markov Models to fMRI data and found that context shifted brain state dynamics in measurable ways. The paper came out in *Imaging Neuroscience* in 2026.

That part is standard. The rest is not.

## One repo, three archives

We built the repository around a simple idea: every piece of the research should have a permanent home, and those homes should all point to each other.

The repo itself lives at [github.com/yibeichan/prettymouth](https://github.com/yibeichan/prettymouth). It contains the full analysis pipeline — numbered scripts from postprocessing through the GLMM, figure notebooks, methodological notes, and environment files. Someone with a DataLad client and a SLURM cluster can reproduce the entire analysis from scratch.

But a GitHub repo is not an archive. So we also created:

- **A Zenodo concept DOI** ([10.5281/zenodo.20369772](https://doi.org/10.5281/zenodo.20369772)) that captures a frozen snapshot of the code at the exact commit used for publication. The concept DOI is permanent and always resolves to the latest version. Each new version gets its own DOI too.
- **An OSF project** ([osf.io/7aqth](https://osf.io/7aqth/)) for derived outputs. The raw fMRI data lives in the Hasson lab narratives dataset via DataLad. But the HMM fits, cluster solutions, and GLMM results — roughly 6.3 GB of derived data — are on OSF under CC-BY-4.0, with provenance docs and manifest files.

The README links all three. So does the CITATION.cff file, which also links to the paper itself.

The result is what I think of as an artifact cluster: paper, code, data, and metadata, each in the right place, all pointing to each other.

## The tag that matters

The most important commit in the repo is `v1.0-published`. It marks the exact codebase that produced the published results. Not the latest commit. Not a zip file from the submission system. The same commit you would get if you checked out that tag today, three years from now, or whenever someone wants to verify the results.

Zenodo points to this tag. The paper cites this tag. The OSF data archive references the commit SHA. If someone finds a bug in a later version, they can always go back to what was actually published.

This is not the same as "the repo is maintained." The tag holds the published version steady so the main branch can keep evolving.

## The AGENTS.md file

One thing we did that I haven't seen elsewhere: we added an AGENTS.md file to the repo. It documents the frozen-pipeline boundaries, known gotchas, and naming conventions — but written for AI coding agents.

This came from a practical observation. Reproducibility used to mean "a human can reproduce the results." Increasingly, it also means "an AI agent can understand and work with this code without hallucinating changes to frozen analysis steps." The AGENTS.md file tells an agent which parts of the pipeline are frozen, which can be modified, and where common mistakes happen.

I do not know if this pattern will last. But it costs nothing to add and it already saved us time when a Claude Code agent needed context about the repository.

## Why this matters

The standard workflow for research code is: write it, submit it, archive a zip, move on.

The problem with that workflow is that nobody actually reproduces results from a zip file. What they do is: find the repo, clone it, try to run it, discover missing dependencies, file an issue, and give up. The zip file satisfies a journal requirement. The repo does the actual work of enabling reuse.

By treating the repository as a first-class artifact — with its own DOI, its own data archive, its own conventions for versioning and AI access — we made it possible for someone to actually use this work. Not just cite it.

The paper is the argument. The repo is the evidence. The data is the raw material. All three should outlast the postdoc who wrote them.

## What I would do differently

Nothing major. But if I were starting over, I would:

- Add a Dockerfile or container definition to the repo, so the environment is fully self-contained without relying on conda channels staying live.
- Set up a scheduled CI check that verifies the analysis still runs, even if nothing has changed. Reproducibility should be tested, not assumed.
- Write the AGENTS.md file earlier. It is easier to document conventions as you build them than to reconstruct them later.

These are small changes. The cost of each is measured in hours. The benefit is measured in the lifetime of the research.

## The broader idea

A paper should not be the end of a research project. It should be the start of its useful life.

The audience for a paper is small — the handful of people in your subfield who read it. The audience for a working repo with data, documentation, and a CI badge is much larger. It includes researchers in adjacent fields, students learning the methods, and people who would never find your paper but will find your code when they search for "HMM fMRI narrative."

The difference between a project that ends with a paper and one that continues after publication is not a difference in funding or resources. It is a difference in how you think about what you are leaving behind.

PrettyMouth is one example. The same pattern works for any project. A tag. A DOI. A README that links everything together. An AGENTS.md if you want to be early on something. None of it is hard. You just have to decide that publishing is not the last thing you do with your research.
