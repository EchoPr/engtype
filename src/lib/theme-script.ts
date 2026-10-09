// Server-safe module: the root layout (a Server Component) inlines this into <head>.
export const THEME_KEY = "theme";

/**
 * Runs before first paint, so the page never flashes the wrong theme.
 * Default is dark; only an explicit "light" choice switches it.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.classList.toggle("dark",t!=="light");document.documentElement.style.colorScheme=t==="light"?"light":"dark"}catch(e){document.documentElement.classList.add("dark")}})()`;
