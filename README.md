
<p align="center">
  <img src="https://github.com/starexxx/Kurayami/blob/842cdfeb5ac4f66ec7e8c4fc466f9f749c40ac8d/Icon/main.jpg" width="200" style="border-radius:30%;border:3px solid #2d2d2d">
  <h1 align="center">Kurayami Miryoku</h1>
  <p align="center"><b>Simple Element Inspector for Mobile Browser</b></p>
</p>

## Features
- **Page Inspection**: View HTML source with syntax highlighting
- **Resource Analysis**: List all external scripts, styles, and images
- **Interactive Console**: Execute JavaScript in page context
- **Mobile Optimized**: Works smoothly on touch devices

## Quick Install
Add this to your webpage:
```html
<script src="https://cdn.jsdelivr.net/gh/starexxx/Kurayami@main/application.js"></script>
```

Or use as bookmarklet:
```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/starexxx/Kurayami@main/application.js';document.body.appendChild(s);})();
```

## How to Use
1. Click the floating button (bottom-right corner)
2. Navigate between tabs:
   - **Info**: Page metadata
   - **Source**: Formatted HTML
   - **Console**: JavaScript execution
   - **Resources**: External files list
3. In Console tab:
   - Type JavaScript code
   - Press "Execute" to run
   - View color-coded output below

## Compatibility
✔ Chrome, Firefox, Safari, Edge  
✔ iOS & Android  
✔ 15KB lightweight

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
