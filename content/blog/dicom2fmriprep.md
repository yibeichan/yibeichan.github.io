---
title: "From DICOMs to fMRIPrep in One Conversation"
date: "2026-03-17"
tags: ["fmri", "skills"]
summary: "I built a Claude Code skill that knows the DICOM→BIDS→fMRIPrep pipeline so you don't have to debug heudiconv heuristics at 2am."
slug: "dicom2fmriprep"
author: "claude"
draft: false
---

I had forty subjects of scan data. Months of planning, beautiful protocol, everything ready. I was going to do science.

Three days later I was staring at a heudiconv traceback. I'd accidentally included Siemens MoCo series in my BIDS dataset. My fMRIPrep job died on the cluster because I forgot `--fs-license-file`. I couldn't remember my research question. That kind of week.

So I built something.

## The pipeline

The DICOM→BIDS→fMRIPrep pipeline is not one tool. It's like five tools duct-taped together, and each one has its own way of punishing you.

### heudiconv

You need a heuristic file to convert your DICOMs. To write that heuristic, you need to inspect `dicominfo.tsv`. To get `dicominfo.tsv`, you need to run heudiconv with `-c none`. To run heudiconv, you need to understand its CLI flags. It's circular. You're already tired.

And then there's the Siemens MoCo thing. Siemens scanners produce motion-corrected duplicates of your BOLD series. If you don't filter them out with `is_motion_corrected`, you get twice the data you expected, and half of it is garbage. The garbage looks perfectly valid. It will silently contaminate your analysis. You won't know until much later. Or maybe you'll never know. That's the worst part.

Oh, and if you forgot `--minmeta`, your JSON sidecars are now 500 lines of Siemens private headers. Fun.

Writing a good heuristic looks simple in the docs. It takes an entire afternoon in practice. Sometimes two.

### BIDS validation

You finally have NIfTIs. You run the validator. It screams:

```
[ERR] func/sub-S001_task-rest_bold.json: TaskName is not defined
[ERR] fmap/sub-S001_dir-AP_epi.json: IntendedFor field is missing
[WARN] .DS_Store is not part of the BIDS specification
```

The `TaskName` one. Every time. You have one task. It's called "rest." The validator knows it's called "rest" because it's in the filename. But the JSON sidecar doesn't say `"TaskName": "rest"`, so we all have to suffer. Why is this still a thing?

### fMRIPrep

fMRIPrep is incredible software. Configuring it is not. Output spaces, CIFTI resolutions, thread counts, memory limits, FreeSurfer licensing, and the question of whether you set `--omp-nthreads` to one less than `--n_cpus` or not. Get one flag wrong and your 12-hour SLURM job dies at minute 3. I've done this more times than I'd like to admit.

### BABS

If you're running fMRIPrep at scale, you're probably using [BABS](https://pennlinc.github.io/babs/). BABS handles DataLad integration, container management, job submission. It's great. But its YAML schema is strict. Not "we'll warn you" strict. It just crashes. The traceback tells you nothing about which key is wrong.

The section has to be called `input_datasets`, not `input_data`. The args go under `bids_app_args`, not `container_args`. You need `$SUBJECT_SELECTION_FLAG` and `$BABS_TMPDIR` in exactly the right places. None of this is well-documented. You learn it from someone who's already been through it, or you learn it the hard way.

## The problem with asking Claude

I've been using Claude Code for a lot of my research workflow. It's good at writing scripts. But when I asked it to generate a heudiconv heuristic, it produced something that *looked* right — correct function signatures, reasonable pattern matching — but it missed the MoCo filter entirely. The BABS config it wrote had the wrong YAML section names.

These aren't bugs. They're the kind of things you only learn from experience. Or from reading source code that nobody reads. The knowledge lives in one person's head in each lab and gets passed down like oral tradition.

I kept thinking about this. What if I could just... put that knowledge somewhere Claude could actually use it?

So I built a [Claude Code skill](https://github.com/yibeichan/claude-skills) called `dicom2fmriprep`. It knows about Siemens MoCo series, the heudiconv two-pass workflow, `--minmeta`, `POPULATE_INTENDED_FOR_OPTS`, the exact BABS YAML schema, all the fMRIPrep flags you'll forget, the BIDS validation errors you'll hit. It doesn't just generate scripts. It asks about your data first, walks through the pipeline step by step, and explains why it's making each choice.

## What it generates

Real outputs from evaluation runs. I want to show these because the details matter.

### The heudiconv heuristic

For a Siemens dataset with T1w MPRAGE, resting-state fMRI, and AP/PA fieldmaps:

```python
POPULATE_INTENDED_FOR_OPTS = {
    'matching_parameters': ['ImagingVolume', 'Shims'],
    'criterion': 'Closest'
}

def infotodict(seqinfo):
    # Single-session study — no {session} in templates
    t1w = create_key('sub-{subject}/anat/sub-{subject}_T1w')
    func_rest = create_key(
        'sub-{subject}/func/sub-{subject}_task-rest_run-{item:02d}_bold'
    )
    fmap_ap = create_key('sub-{subject}/fmap/sub-{subject}_dir-AP_epi')
    fmap_pa = create_key('sub-{subject}/fmap/sub-{subject}_dir-PA_epi')

    info = {t1w: [], func_rest: [], fmap_ap: [], fmap_pa: []}

    for s in seqinfo:
        # ---- Skip motion-corrected and derived reconstructions ----
        if s.is_motion_corrected or s.is_derived:
            continue

        protocol = s.protocol_name.lower()
        # ... pattern matching for each modality ...
```

A few things worth noting.

That `is_motion_corrected or s.is_derived` check. This is the single most important thing in the whole file. Without it, Siemens data will have duplicate BOLD series that look valid but are the scanner's online motion correction output. The without-skill version didn't have this filter at all. At all.

`POPULATE_INTENDED_FOR_OPTS` with `ImagingVolume` and `Shims` matching. This tells heudiconv to automatically set `IntendedFor` in your fieldmap sidecars, matching fieldmaps to BOLD runs based on volume overlap and shim settings. The without-skill version used `ModalityAcquisitionLabel`, which is less specific and can mislink fieldmaps in multi-run protocols.

No `{session}` in the BIDS paths. Sounds trivial. But the without-skill version included `{session}` placeholders everywhere, which creates unnecessary directory nesting and can confuse downstream tools.

### The BABS config

Full YAML. I'm showing all of it because every section matters:

```yaml
input_datasets:
    BIDS:
        required_files:
            - "func/*_bold.nii*"
            - "anat/*_T1w.nii*"
        is_zipped: false
        origin_url: "/project/data/bids_datalad"
        path_in_babs: inputs/data/BIDS

cluster_resources:
    interpreting_shell: "/bin/bash"
    hard_memory_limit: 32G
    temporary_disk_space: 200G
    number_of_cpus: "8"
    hard_runtime_limit: "24:00:00"
    customized_text: |
        #SBATCH -p normal
        #SBATCH --nodes=1
        #SBATCH --ntasks=1
        #SBATCH --propagate=NONE

script_preamble: |
    source "${CONDA_PREFIX}"/bin/activate babs
    module load singularity/3.8
    export TEMPLATEFLOW_HOME=/scratch/${USER}/templateflow

job_compute_space: "/scratch/${USER}/babs_tmp"

singularity_args:
    - --cleanenv

bids_app_args:
    $SUBJECT_SELECTION_FLAG: "--participant-label"
    -w: "$BABS_TMPDIR"
    --fs-license-file: "/path/to/freesurfer/license.txt"
    --output-spaces: "MNI152NLin2009cAsym:res-2"
    --cifti-output: "91k"
    --force-bbr: ""
    --n_cpus: "8"
    --omp-nthreads: "7"
    --mem-mb: "30000"
    --skip-bids-validation: ""
    --notrack: ""

zip_foldernames:
    fmriprep: "24-1-1"
    freesurfer: "24-1-1"

alert_log_messages:
    stdout:
        - "fMRIPrep failed"
        - "Cannot allocate memory"
        - "Excessive topologic defect encountered"
        - "mris_curvature_stats: Could not open file"
        - "Numerical result out of range"
        - "No such file or directory"
```

If you've wrestled with BABS configs before, you'll notice the details. `$SUBJECT_SELECTION_FLAG` and `$BABS_TMPDIR` are BABS-specific variables interpolated at runtime — miss these and BABS can't parallelize across subjects. The `alert_log_messages` are stdout patterns BABS watches for to detect failures. "Cannot allocate memory" and "Excessive topologic defect encountered" are the ones that save you from wasting cluster hours. `zip_foldernames` version string (`24-1-1`) has to match your container. `--omp-nthreads: "7"` with `--n_cpus: "8"` — always one less, leaving a thread for orchestration.

The without-skill version didn't use the correct BABS YAML section names. The config would crash on `babs init`. You'd spend an hour figuring out why.

### BIDS validation fixes

Both with-skill and without-skill handled BIDS fixes fine. Adding `TaskName` to functional sidecars, setting `IntendedFor` in fieldmap JSONs, removing `.DS_Store`. This makes sense — patching JSON files is just file manipulation. No deep domain knowledge required.

I actually think this is interesting. It shows exactly where the skill adds value and where it doesn't. Simple file manipulation? Claude already knows how to do that. Domain-specific gotchas that live in one person's head? That's where it falls apart without help.

## The numbers

Three evaluations, each testing a different pipeline stage:

| Eval | With Skill | Without Skill | What the skill caught |
|------|-----------|---------------|----------------------|
| heudiconv heuristic | 8/8 (100%) | 6/8 (75%) | MoCo filtering, `--minmeta` |
| BABS setup | 10/10 (100%) | 7/10 (70%) | YAML schema, container setup |
| BIDS fix | 5/5 (100%) | 5/5 (100%) | — (both nailed it) |
| **Total** | **23/23 (100%)** | **18/23 (78%)** | |

The overhead:

| Metric | With Skill | Without Skill | Delta |
|--------|-----------|---------------|-------|
| Avg tokens | 28,766 | 17,140 | +11,626 (~1.7x) |
| Avg time | 101.8s | 98.7s | +3.1s |

About 3 extra seconds and some additional tokens. That's Claude reading the skill's reference material. In exchange, you avoid MoCo contamination that takes hours to debug, BABS crashes that waste a day of cluster allocation, and sidecar bloat that makes your dataset annoying to work with.

I should be honest — these are single-run benchmarks across 3 test cases. This isn't a Nature paper. But the pattern is clear enough. The skill's value is concentrated in the gotchas that even a good LLM misses without specialized context.

## Try it

```bash
npx @yibeichen/claude-skills install dicom2fmriprep
```

You can say something like:

> I have Siemens DICOM data from a resting-state study with T1w, BOLD, and AP/PA fieldmaps. Help me set up the full pipeline from DICOMs to fMRIPrep on our SLURM cluster.

It'll ask about your data — scanner manufacturer, protocol names, number of sessions, cluster setup — before generating anything.

Or jump to a specific step:

> Write me a heudiconv heuristic for my dataset. Here's my dicominfo.tsv: [paste or attach]

> Generate a BABS config for fMRIPrep 24.1.1 with CIFTI output on a SLURM cluster.

## What's next

Right now it handles the most common Siemens single-session workflow. I'm planning GE and Philips support (different scanners, different problems), multi-session and multi-echo evaluations, anat-only workflows, and more eval scenarios.

If you've got a pipeline gotcha that caught you off guard, it probably belongs in the skill. The code is at [github.com/yibeichan/claude-skills](https://github.com/yibeichan/claude-skills).

I built this because I got tired of the pipeline being a barrier to the science. The preprocessing step shouldn't be the thing that breaks you. If this saves you one afternoon of debugging MoCo duplicates or BABS YAML typos, then good. Go do your research.
