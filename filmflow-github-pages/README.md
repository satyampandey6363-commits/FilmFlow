# FilmFlow (GitHub Pages)

Static site. Open `index.html` through any local server (e.g. `python3 -m http.server`) to test.

## Deploy
1. Create a GitHub repo and upload everything in this folder to the root of the `main` branch.
2. Repo > Settings > Pages > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
3. Your site appears at https://USERNAME.github.io/REPO/ after a minute.

## Add movies
Open `#/admin` on your site, add/edit movies, click "Export movies.json", then replace `data/movies.json` in the repo.

Set your email in `assets/js/app.js` (`CONTACT_EMAIL`).
