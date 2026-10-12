# HAT Predict frontend starter

A standalone HTML/CSS/JavaScript prototype. No Python chemistry, Django, backend server, API key or payment setup is required. Ketcher is bundled when the ketcher/ directory is present. Saved example data is explicitly labeled and comes from the supplied local one-site prediction (17.62 kcal/mol); arbitrary inputs do not produce new predictions.

## 1. Open it locally on your Windows/Ubuntu laptop

Download and extract the ZIP with Windows File Explorer. Find the inner hat-predict-frontend folder containing index.html. Keep this separate from your existing ~/hat-predict project.

In Ubuntu (WSL), use the Windows Downloads path below. If you extracted elsewhere, change the path. `ls` should show index.html, css, js, ketcher, and this README:

```bash
cd /mnt/c/Users/ssutl/Downloads/hat-predict-frontend
ls
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080 in your Windows browser. Keep the terminal open; Ctrl+C stops the preview. If port 8080 is busy, change 8080 to 8081 in both the command and browser address. Do not double-click index.html: Ketcher requires an HTTP preview. This frontend server is separate from your Django development server.

If you instead extract the ZIP inside Ubuntu, use that actual folder path. You do not need to activate hatpredict_env.

## 2. Things to try

1. Watch the hydrogen tap above the letters and float up. The original SVG choreography is embedded intact: its title movement, spring, dot growth, and splitting circles retain their original timing and paths. Replay or skip it.
2. Click SMILES, then Load example, then View example result. Confirm 17.62 and the saved-example label.
3. Change a SMILES input. Confirm it does not assign the example prediction to a new structure.
4. Return to the opening screen, click Draw it, and wait for both Ketcher editors to load. Load example, modify a drawing, and export by pressing the result button. The drawing mode hides text fields and exports structures behind the scenes. Choose SMILES separately to type inputs.
5. Open About, Credits and Licenses. Escape closes the dialog.
6. Explore .xyz. Upload separate A• and B–H files. Each panel shows the filename, atom count and a numbered XY atom-coordinate preview; Replace/Remove controls are independent. Charge and site fields are draft inputs only. Nothing is uploaded; no bonds are inferred and no prediction is calculated.
7. Narrow the browser window. Panels stack on a small screen. Use Tab to navigate buttons and inputs.

Use F12 > Console if a button does not work. F12 > Network reveals missing files (404). Hard refresh with Ctrl+Shift+R after edits. Verification performed during preparation: JavaScript syntax and local asset checks; no real browser execution was available here. Test Ketcher and layouts yourself before presenting.

## 3. Put it on GitHub using GitHub Desktop (recommended)

Ketcher contains many files. GitHub Desktop avoids browser upload limits and command-line login setup.

1. Install GitHub Desktop from https://desktop.github.com/ on Windows and sign in.
2. Choose File > New repository. Name it hat-predict-frontend. Pick a local parent folder such as Documents/GitHub. Create repository.
3. Choose Repository > Show in Explorer. This opens the new repository folder.
4. Copy the CONTENTS of the extracted starter folder into this repository folder. index.html must sit directly in the repository root, not inside an extra hat-predict-frontend subfolder. Copy css/, js/, assets/ if present, ketcher/, README.md, THIRD_PARTY.md and the remaining starter files. Show hidden files in Explorer and include .nojekyll and .gitignore; .nojekyll is also checked by the publish workflow.
5. Return to GitHub Desktop. In Summary type “Add HAT Predict frontend prototype” and click Commit to main.
6. Click Publish repository. For free GitHub Pages, uncheck “Keep this code private” so the repository is public. Publish only this frontend starter and bundled editor; do not copy your Django secret files, datasets, unpublished manuscript, or model.
7. Click Repository > View on GitHub to open the repository.

GitHub Desktop stores changes locally until you Push origin. Public means others can read these files; confirm the example/credits can be shared with your lab. If public sharing is not appropriate, keep the repo private and use local preview until you decide on private hosting.

## 4. Make the website live with GitHub Pages

In the GitHub repository:

1. Settings > Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Choose main and /(root), then Save.
4. Wait a few minutes. The Pages screen displays the published URL, normally:
   https://YOUR_USERNAME.github.io/hat-predict-frontend/
5. Open that URL and test the checklist again, including BOTH Ketcher editors.

GitHub Free supports Pages for public repositories. No custom domain or payment details are needed for this public static prototype. It cannot execute the Python/xTB backend. Asset paths are relative so the project subpath works. The included .nojekyll prevents bundled files with underscores from being excluded by Jekyll. If you missed copying it, create a blank file named .nojekyll in the repository root through GitHub's Add file > Create new file.

If the page is 404: check Pages/main/root, ensure index.html is at the root, and give deployment up to ten minutes. If drawing fails, ensure ketcher/index.html and its assets were committed. Do not rename individual bundled Ketcher files.

## 5. Change it and publish updates

Open the repository folder with a code editor such as VS Code:

| File | Purpose |
|---|---|
| index.html | Page layout, copy, inputs, footer |
| css/main.css | Colors, fonts, spacing and small-screen layout |
| js/animation.js | Replay and Skip controls for the original SVG |
| index.html, embedded SVG | Original animation paths and timing |
| assets/original-intro.svg | Unmodified original artwork for reference |
| js/app.js | Navigation, Ketcher integration, example result, dialogs |
| ketcher/ | Third-party editor bundle; normally leave unchanged |
| THIRD_PARTY.md | Attribution and license notes |

Run the local Python HTTP server FROM THE REPOSITORY FOLDER you are editing. Test changes. In GitHub Desktop write a summary, Commit to main, then Push origin. GitHub Pages updates automatically.

## 6. Connect a backend later

The submitPrediction() function in js/app.js is the connection point. Replace the saved-example branch with a POST request to the eventual prediction API. Keep API credentials out of frontend code. Add loading/error states and validated result rendering once that API exists. The .xyz workflow needs chemical bonding, reaction selection and backend handling; the current local format check is not scientific validation.

## Scope

This starter intentionally shows only one saved reaction site. It does not claim full product selectivity, model scope, or accuracy for new molecules. Confirm paper attribution and final scientific text with your post-doc. The Ketcher negative-charge convention follows your existing Django UI, not a chemical claim that anions and radicals are interchangeable. No account system or daily quotas are implemented.

Documentation checked:
- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://github.com/epam/ketcher

The opening screen now uses the actual original hat-predict-footer.svg artwork, not the recreated JavaScript animation. SVG links are wired to input screens and information dialogs. The original title movement is preserved exactly, including its upward shift. Reduced-motion users see the original static scene.
