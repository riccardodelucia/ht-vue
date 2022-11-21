# Vue HT

This package is used to manage Vue HT components, reusable across Vue-based projects. The project is based on **Vite** (https://vitejs.dev/), and it is published as a private NPM package managed through **Verdaccio** (https://verdaccio.org/).

## Build package

```
npm run build
```

## Publish package

From the current project's root directory:

```
npm publish --registry [verdaccio's URL address]
```

Rememebr to increment the **version** field of the **packjage.json**

## Test the package

In the current project's root folder:

```
npm link
```

Then link the package in the target project (no need to run `npm install`):

```
npm link vue-ht-components
```

Now the package is available in the project. Each new package rebuild brings all modifications to the target project.

### Unlinking the package

1 - In the target project:

```
npm unlink --no-save vue-ht-components
```

2 - In the library project's root folder:

```
npm unlink
```

## Important notes

This package relies on an external **ht-design** private package, which only provides the style and the fonts. Nevertheless, the style code is directly bundled within this package. The reason is that it appears to be difficult to add link the fonts from **ht-design** to the corresponding stylesheet. This happens because **ht-design** doesn't execute any
