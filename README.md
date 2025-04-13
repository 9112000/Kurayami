# Starexx Page Inspector

A powerful debugging tool that provides real-time page inspection capabilities with a clean, intuitive interface.

## Features

### Comprehensive Inspection
- View syntax-highlighted page source with Prism.js
- One-click copy entire HTML
- Analyze all external resources (scripts, styles, images)

### Interactive Console
- Execute JavaScript in page context
- Captures all `console.log()`, `.warn()`, `.error()` output
- Preserves command history between sessions
- Color-coded output (standard/warning/error)

### Intuitive UI
- Draggable launch button
- iOS-style tab navigation
- Swipe gestures for tab switching
- Responsive design

## Installation

1. Simply include the script in your page or the javascript in your browser
```html
<script src="https://cdn.jsdelivr.net/gh/starexxx/elonmusk14kids@main/saygex.js"></script>
```
```js
// ==UserScript==
// @name         Starexx
// @version      1.3
// @description  Simple Page Inspector!
// @author       Starexx
// @run-at       document-end
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    javascript:(function(){      var s = document.createElement('script');      s.src = 'https://cdn.jsdelivr.net/gh/starexxx/elonmusk14kids@main/saygex.js';      document.body.appendChild(s);  })();
})();
```
2. The inspector icon will appear in bottom-right corner

## Usage

- Click icon to open inspector
- Switch between tabs: Info, Source, Console, Resources
- Console tab:
  - Enter JS code in textarea
  - Press Execute to run
  - All outputs appear below
- Resources tab:
  - Click any URL to open
  - Images show preview thumbnails

## Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-friendly (tested on iOS/Android)
- Lightweight (~15KB minified)

## Author

**Starexx**  - [GitHub Profile](https://github.com/starexxx)

## License
[MIT License](LICENSE)- Free for personal and commercial use
