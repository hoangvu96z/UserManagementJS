# Frontend Mobile (Ionic)

Ionic/Capacitor wrapper of the existing Angular web app for mobile platforms.

## Getting started

```bash
npm install
npm run start
```

## Build web assets

```bash
npm run build
```

## Prepare native platforms

After building web assets (outputting to `www/`), sync Capacitor to each platform:

```bash
npm run prepare:android
npm run prepare:ios
```

Once the platforms are added the first time, you can open the native IDEs with:

```bash
npx cap open android
npx cap open ios
```
