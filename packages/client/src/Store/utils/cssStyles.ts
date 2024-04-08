const extractCssRules = (): string[] => {
    return Array.from(document.styleSheets)
        .map(sheet => {
            if (!sheet?.cssRules) {
                return
            }
            return sheet?.cssRules
        })
        .reduce<string[]>((cssRules, next) => {
            if (!next) {
                return cssRules
            }

            Object.values(next).map(cssRule => {
                if (!cssRule) {
                    return
                }
                try {
                    cssRules.push(cssRule.cssText)
                } catch (error) {
                    // TODO app level error
                    console.warn(cssRule)
                }

            })
            return cssRules
        }, [])

}

const getCssTextByClassName = (selectorText: string, rules = extractCssRules) => {
    return rules()
        .filter(rule => {
            return rule?.includes(selectorText)
        })

}

const resetCss = () => {
    return `
/*
  https://www.joshwcomeau.com/css/custom-css-reset/
  1. Use a more-intuitive box-sizing model.
*/
*,
*::before,
*::after {
    box-sizing: border-box;
}

/*
    2. Remove default margin
  */
* {
    margin: 0;
}

/*
    Typographic tweaks!
    3. Add accessible line-height
    4. Improve text rendering
  */
body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}

/*
    5. Improve media defaults
  */
img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}

/*
    6. Remove built-in form typography styles
  */
input,
button,
textarea,
select {
    font: inherit;
}

/*
    7. Avoid text overflows
  */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
    overflow-wrap: break-word;
}

ul {
    padding: 0;
}

/*
    8. Create a root stacking context
  */
html,
body,
:global(#main) {
    min-height: 100vh;
    isolation: isolate;
    font-family: Roboto, sans-serif;
    background-color: #FFFFFF;
}

html {
    transition: background .5s ease-in-out;
}`
}

export {
    getCssTextByClassName,
    resetCss,
}
