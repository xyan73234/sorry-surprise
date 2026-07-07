# Sorry Surprise 💕

A cute, playful mini-site with an apology, compensation page, and a card-dealing image reveal gallery.

## Add background music

1. Get the song legally and save it as:

   `audio/hate-that-i-made-you-love-me.mp3`

   Song: **"Hate That I Made You Love Me"** by Ariana Grande

2. Music starts after the first tap/click (browser rule). Use the **♪** button to pause.

## Add your images

1. Open the `images/` folder.
2. Add 10 photos named `image-1.jpg` through `image-10.jpg`.
3. See `images/README.txt` for more detail.

## Preview locally

Open `index.html` in your browser, or run a simple server:

```bash
npx serve .
```

Then visit the URL it prints (usually http://localhost:3000).

## Share as a link (free)

The easiest way to get a link you can text to someone:

### Option A: Netlify Drop (no account needed)

1. Go to https://app.netlify.com/drop
2. Drag the entire `sorry-surprise` folder onto the page.
3. Netlify gives you a link like `https://something-random.netlify.app` — send that!

### Option B: Vercel

1. Create a free account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. In this folder, run: `vercel`
4. Follow the prompts — you'll get a public URL.

### Option C: GitHub Pages

1. Push this folder to a GitHub repo.
2. In repo Settings → Pages → deploy from `main` branch, root folder.
3. Your site will be at `https://yourusername.github.io/repo-name/`

## Customize text

Edit `index.html` to change any messages or button labels.

## Customize animations

Edit `styles.css` — look for `@keyframes dealCard` and `@keyframes revealFlip`.
