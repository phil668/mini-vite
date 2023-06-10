import { readFile } from 'fs-extra'
import type { Plugin } from '../plugin'

function cssPlugin(): Plugin {
  return {
    name: 'pvite:css',
    load(id) {
      if (id.endsWith('.css'))
        return readFile(id, { encoding: 'utf-8' })
    },
    transform(code, id) {
      if (id.endsWith('.css')) {
        const jsContent = `
                const css = '${code.replace(/\n/g, '')}';
                const style = document.createElement('style');
                style.setAttribute("type","text/css");
                style.innerHTML = css;
                document.head.appendChild(style);
                export default css
            `
          .trim()
        return {
          code: jsContent,
        }
      }
      return null
    },
  }
}

export { cssPlugin }
