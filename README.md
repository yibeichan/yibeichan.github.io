# Yibei Chen - Academic Portfolio

## Setting Up GitHub Secrets

To securely store and manage sensitive information such as API keys and access tokens, you can use GitHub Secrets. Follow the steps below to set up GitHub Secrets for this repository:

1. **Navigate to the repository on GitHub:**
   Go to the main page of the repository on GitHub.

2. **Go to the Settings tab:**
   Click on the "Settings" tab at the top of the repository page.

3. **Access Secrets:**
   In the left sidebar, click on "Secrets and variables" and then select "Actions".

4. **Add a new secret:**
   Click on the "New repository secret" button.

5. **Create secrets for ORCID API:**
   Add the following secrets:
   - `ORCID_CLIENT_ID`: Your ORCID client ID.
   - `ORCID_CLIENT_SECRET`: Your ORCID client secret.

6. **Save the secrets:**
   Click the "Add secret" button to save each secret.

Once the secrets are added, they can be accessed in your GitHub Actions workflows using the `secrets` context.

## Example GitHub Actions Workflow

Here is an example of a GitHub Actions workflow file (`.github/workflows/set-secrets.yml`) that sets up the `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET` secrets:

```yaml
name: Set Secrets

on:
  push:
    branches:
      - main

jobs:
  set-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set ORCID secrets
        run: |
          echo "ORCID_CLIENT_ID=${{ secrets.ORCID_CLIENT_ID }}"
          echo "ORCID_CLIENT_SECRET=${{ secrets.ORCID_CLIENT_SECRET }}"
```

This workflow will run whenever there is a push to the `main` branch and will set the ORCID secrets for use in your scripts.
