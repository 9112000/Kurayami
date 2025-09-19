(function() {
    let isDragging = false, offsetX, offsetY, sourcePanel, copyBtn, currentTab = "Console", tabButtons = [];
    
    // Load required external resources
    if (!document.querySelector("#prismjs")) {
        let prismScript = document.createElement("script");
        prismScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
        prismScript.id = "prismjs";
        document.head.appendChild(prismScript);
        
        let prismCSS = document.createElement("link");
        prismCSS.rel = "stylesheet";
        prismCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css";
        document.head.appendChild(prismCSS);
        
        let interFont = document.createElement("link");
        interFont.rel = "stylesheet";
        interFont.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
        document.head.appendChild(interFont);
        
        let firaCode = document.createElement("link");
        firaCode.rel = "stylesheet";
        firaCode.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap";
        document.head.appendChild(firaCode);
    }

    // Add global styles
    let style = document.createElement("style");
    style.textContent = `
        * {
            -webkit-tap-highlight-color: transparent !important;
            -webkit-user-select: none !important;
            user-select: none !important;
        }
        
        .kurayami-btn {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            cursor: grab !important;
            border-radius: 30% !important;
            z-index: 10000 !important;
            transition: opacity 0.2s ease !important;
            opacity: 0.3 !important;
            box-shadow: none !important;
            font-family: 'Inter', sans-serif !important;
        }
        
        .kurayami-panel {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 60% !important;
            border: none !important;
            background: #2D2A2E !important;
            color: white !important;
            z-index: 9999 !important;
            display: flex !important;
            flex-direction: column !important;
            transform: translateY(100%) !important;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            font-family: 'Inter', sans-serif !important;
            box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.5) !important;
            border-radius: 0 !important;
            overflow: hidden !important;
        }
        
        .kurayami-panel.show {
            transform: translateY(0) !important;
        }
        
        .kurayami-nav {
            display: flex !important;
            background: #221F22 !important;
            border-bottom: 1px solid #403E41 !important;
            justify-content: space-around !important;
            font-size: 13px !important;
            font-family: 'Inter', sans-serif !important;
            padding: 0 10px !important;
        }
        
        .kurayami-tab {
            flex: 1 !important;
            padding: 12px 8px !important;
            background: none !important;
            color: #939293 !important;
            border: none !important;
            cursor: pointer !important;
            position: relative !important;
            outline: none !important;
            font-family: 'Inter', sans-serif !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
        }
        
        .kurayami-tab.active {
            color: #FFD866 !important;
            font-weight: 600 !important;
        }
        
        .kurayami-tab.active::after {
            content: '' !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 25% !important;
            width: 50% !important;
            height: 3px !important;
            background: #FFD866 !important;
        }
        
        .kurayami-content {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 15px !important;
            font-size: 13px !important;
            background: #2D2A2E !important;
            position: relative !important;
            border: none !important;
            font-family: 'Fira Code', monospace !important;
        }
        
        .kurayami-console {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            gap: 12px !important;
        }
        
        .kurayami-console-input {
            width: 100% !important;
            min-height: 60px !important;
            background: #221F22 !important;
            color: #A9DC76 !important;
            border: 1px solid #403E41 !important;
            resize: none !important;
            border-radius: 0 !important;
            font-size: 13px !important;
            outline: none !important;
            padding: 12px !important;
            font-family: 'Fira Code', monospace !important;
            transition: border 0.2s ease !important;
        }
        
        .kurayami-console-input:focus {
            border-color: #FFD866 !important;
        }
        
        .kurayami-console-output {
            flex: 1 !important;
            overflow-y: auto !important;
            background: #221F22 !important;
            padding: 12px !important;
            border-radius: 0 !important;
            border: 1px solid #403E41 !important;
            font-family: 'Fira Code', monospace !important;
            color: #FCFCFA !important;
            font-size: 13px !important;
        }
        
        .kurayami-log {
            color: #A9DC76 !important;
            margin-bottom: 8px !important;
            line-height: 1.5 !important;
            white-space: pre-wrap !important;
        }
        
        .kurayami-warn {
            color: #FFD866 !important;
            margin-bottom: 8px !important;
            line-height: 1.5 !important;
            white-space: pre-wrap !important;
        }
        
        .kurayami-error {
            color: #FF6188 !important;
            margin-bottom: 8px !important;
            line-height: 1.5 !important;
            white-space: pre-wrap !important;
        }
        
        .kurayami-section {
            background: #221F22 !important;
            padding: 15px !important;
            border-radius: 0 !important;
            margin-bottom: 15px !important;
            border: 1px solid #403E41 !important;
        }
        
        .kurayami-section-title {
            color: #FFD866 !important;
            font-weight: 600 !important;
            margin-bottom: 12px !important;
            font-size: 14px !important;
        }
        
        .kurayami-section-content {
            color: #FCFCFA !important;
        }
        
        .kurayami-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 15px !important;
        }
        
        .kurayami-table th {
            background: #403E41 !important;
            color: #FFD866 !important;
            padding: 8px !important;
            text-align: left !important;
            border: 1px solid #5B595C !important;
            font-weight: 600 !important;
        }
        
        .kurayami-table td {
            padding: 8px !important;
            border: 1px solid #5B595C !important;
            color: #FCFCFA !important;
            white-space: pre-wrap !important;
            word-break: break-all !important;
        }
        
        .kurayami-table tr:nth-child(even) {
            background: #363438 !important;
        }
        
        .kurayami-resource-box {
            background: #221F22 !important;
            padding: 15px !important;
            border-radius: 0 !important;
            margin-bottom: 15px !important;
            border: 1px solid #403E41 !important;
        }
        
        .kurayami-resource-header {
            color: #FFD866 !important;
            font-weight: 600 !important;
            margin-bottom: 12px !important;
            font-size: 14px !important;
        }
        
        .kurayami-resource-url {
            color: #78DCE8 !important;
            text-decoration: none !important;
            display: block !important;
            margin-bottom: 6px !important;
            font-size: 12px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }
        
        .kurayami-resource-url:hover {
            text-decoration: underline !important;
        }
        
        .kurayami-image-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
            margin-top: 10px !important;
        }
        
        .kurayami-image-item {
            background: #363438 !important;
            padding: 10px !important;
            border: 1px solid #5B595C !important;
        }
        
        .kurayami-image-preview {
            max-width: 100% !important;
            max-height: 100px !important;
            display: block !important;
            margin-bottom: 6px !important;
        }
        
        .kurayami-network-table {
            width: 100% !important;
            border-collapse: collapse !important;
        }
        
        .kurayami-network-table th {
            background: #403E41 !important;
            color: #FFD866 !important;
            padding: 8px !important;
            text-align: left !important;
            border: 1px solid #5B595C !important;
            font-weight: 600 !important;
        }
        
        .kurayami-network-table td {
            padding: 8px !important;
            border: 1px solid #5B595C !important;
            color: #FCFCFA !important;
            cursor: pointer !important;
            white-space: pre-wrap !important;
            word-break: break-all !important;
        }
        
        .kurayami-network-table tr:nth-child(even) {
            background: #363438 !important;
        }
        
        .kurayami-network-table tr:hover {
            background: #4A484B !important;
        }
        
        .kurayami-copy-btn {
            position: absolute !important;
            top: 20px !important;
            right: 20px !important;
            background: #403E41 !important;
            color: #FFD866 !important;
            border: 1px solid #5B595C !important;
            padding: 6px 10px !important;
            cursor: pointer !important;
            z-index: 10001 !important;
            display: none !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        
        .kurayami-copy-btn:hover {
            background: #4A484B !important;
        }
        
        .kurayami-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(45, 42, 46, 0.95) !important;
            z-index: 10000 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        
        .kurayami-modal-content {
            background: #221F22 !important;
            padding: 20px !important;
            border-radius: 0 !important;
            width: 80% !important;
            max-height: 80% !important;
            overflow: auto !important;
            border: 1px solid #403E41 !important;
        }
        
        .kurayami-close-btn {
            margin-top: 15px !important;
            padding: 8px 16px !important;
            background: #FFD866 !important;
            border: none !important;
            color: #221F22 !important;
            cursor: pointer !important;
            font-weight: 600 !important;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px !important;
        }
        
        ::-webkit-scrollbar-track {
            background: #221F22 !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #5B595C !important;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #6D6B6E !important;
        }
        
        /* Source code styling */
        pre[class*="language-"] {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            white-space: pre !important;
            overflow-x: auto !important;
        }
        
        code[class*="language-"] {
            font-family: 'Fira Code', monospace !important;
            font-size: 12px !important;
            white-space: pre !important;
        }
        
        .line-numbers .line-numbers-rows {
            border-right: 1px solid #403E41 !important;
        }
        
        .line-numbers-rows > span:before {
            color: #939293 !important;
        }
    `;
    document.head.appendChild(style);

    // Create floating button
    let btn = document.createElement("img");
    btn.src = "https://raw.githubusercontent.com/starexxx/Kurayami/7b2b2c3f1aee1517d5ab6c22e01b09fabb70b4fd/Icon/icon.jpg";
    btn.className = "kurayami-btn";
    btn.draggable = false;

    // Drag functionality
    function startDrag(e) {
        isDragging = true;
        let event = e.type.includes("touch") ? e.touches[0] : e;
        offsetX = event.clientX - btn.getBoundingClientRect().left;
        offsetY = event.clientY - btn.getBoundingClientRect().top;
        btn.style.transition = "none";
        btn.style.opacity = "0.9";
    }

    function dragMove(e) {
        if (!isDragging) return;
        if (e.type === "touchmove") e.preventDefault();
        let event = e.type.includes("touch") ? e.touches[0] : e;
        btn.style.left = (event.clientX - offsetX) + "px";
        btn.style.top = (event.clientY - offsetY) + "px";
    }

    function stopDrag() {
        isDragging = false;
        btn.style.transition = "opacity 0.2s ease";
        btn.style.opacity = "0.3";
    }

    btn.addEventListener("mousedown", startDrag);
    btn.addEventListener("touchstart", startDrag);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);

    // Main panel functionality
    function toggleSourceCode() {
        if (isDragging) return;
        if (sourcePanel) {
            sourcePanel.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(sourcePanel);
                sourcePanel = null;
            }, 400);
            return;
        }

        fetch(document.location.href)
            .then(res => res.text())
            .then(html => {
                sourcePanel = document.createElement("div");
                sourcePanel.className = "kurayami-panel";
                sourcePanel.classList.add("show");

                const navBar = document.createElement("div");
                navBar.className = "kurayami-nav";

                const tabs = ["Console", "Source", "Info", "Resources", "Network"];
                tabButtons = [];
                let tabContents = {};

                tabs.forEach(tab => {
                    let btn = document.createElement("button");
                    btn.className = "kurayami-tab";
                    btn.innerText = tab;
                    if (tab === currentTab) {
                        btn.classList.add("active");
                    }
                    btn.onclick = () => switchTab(tab);
                    navBar.appendChild(btn);
                    tabButtons.push(btn);
                });

                const contentArea = document.createElement("div");
                contentArea.className = "kurayami-content";

                function switchTab(tab, direction) {
                    currentTab = tab;
                    
                    tabButtons.forEach(btn => {
                        btn.classList.remove("active");
                    });
                    
                    const activeBtn = tabButtons[tabs.indexOf(tab)];
                    activeBtn.classList.add("active");

                    if (direction) {
                        contentArea.style.transform = `translateX(${direction === 'left' ? '100%' : '-100%'})`;
                        contentArea.style.opacity = '0';
                        setTimeout(() => {
                            contentArea.innerHTML = "";
                            contentArea.appendChild(tabContents[tab]);
                            contentArea.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                            contentArea.style.transform = 'translateX(0)';
                            contentArea.style.opacity = '1';
                        }, 10);
                    } else {
                        contentArea.innerHTML = "";
                        contentArea.appendChild(tabContents[tab]);
                    }

                    if (tab === "Source") {
                        Prism.highlightAll();
                        copyBtn.style.display = "block";
                    } else {
                        copyBtn.style.display = "none";
                    }
                }

                // Console Tab
                const consoleArea = document.createElement("div");
                consoleArea.className = "kurayami-console";
                
                const consoleInput = document.createElement("textarea");
                consoleInput.className = "kurayami-console-input";
                consoleInput.placeholder = "Enter JavaScript code and press Enter to execute";
                
                const consoleOutput = document.createElement("div");
                consoleOutput.className = "kurayami-console-output";
                
                const originalConsole = {
                    log: console.log,
                    warn: console.warn,
                    error: console.error,
                    info: console.info
                };
                
                function captureConsole() {
                    console.log = function() {
                        originalConsole.log.apply(console, arguments);
                        const args = Array.from(arguments).map(arg => 
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                        ).join(' ');
                        const entry = document.createElement("div");
                        entry.className = "kurayami-log";
                        entry.textContent = "> " + args;
                        consoleOutput.appendChild(entry);
                        consoleOutput.scrollTop = consoleOutput.scrollHeight;
                    };
                    
                    console.warn = function() {
                        originalConsole.warn.apply(console, arguments);
                        const args = Array.from(arguments).join(' ');
                        const entry = document.createElement("div");
                        entry.className = "kurayami-warn";
                        entry.textContent = "> " + args;
                        consoleOutput.appendChild(entry);
                        consoleOutput.scrollTop = consoleOutput.scrollHeight;
                    };
                    
                    console.error = function() {
                        originalConsole.error.apply(console, arguments);
                        const args = Array.from(arguments).join(' ');
                        const entry = document.createElement("div");
                        entry.className = "kurayami-error";
                        entry.textContent = "> " + args;
                        consoleOutput.appendChild(entry);
                        consoleOutput.scrollTop = consoleOutput.scrollHeight;
                    };
                }
                
                captureConsole();
                
                consoleInput.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        try {
                            const code = consoleInput.value;
                            const result = eval(code);
                            
                            const inputEntry = document.createElement("div");
                            inputEntry.className = "kurayami-log";
                            inputEntry.textContent = "> " + code;
                            consoleOutput.appendChild(inputEntry);
                            
                            if (result !== undefined) {
                                const resultEntry = document.createElement("div");
                                resultEntry.className = "kurayami-log";
                                resultEntry.textContent = result;
                                consoleOutput.appendChild(resultEntry);
                            }
                            
                            consoleOutput.scrollTop = consoleOutput.scrollHeight;
                            consoleInput.value = "";
                        } catch (error) {
                            const errorEntry = document.createElement("div");
                            errorEntry.className = "kurayami-error";
                            errorEntry.textContent = "Error: " + error.message;
                            consoleOutput.appendChild(errorEntry);
                            consoleOutput.scrollTop = consoleOutput.scrollHeight;
                        }
                    }
                });
                
                consoleArea.appendChild(consoleInput);
                consoleArea.appendChild(consoleOutput);
                tabContents["Console"] = consoleArea;

                // Source Tab
                const pre = document.createElement("pre");
                const codeEl = document.createElement("code");
                codeEl.className = "language-html line-numbers";
                codeEl.textContent = html;
                pre.appendChild(codeEl);
                tabContents["Source"] = pre;

                // Resources Tab
                const resourcesContainer = document.createElement("div");
                
                const excludeUrls = [
                    "https://raw.githubusercontent.com/starexxx/Kurayami/7b2b2c3f1aee1517d5ab6c22e01b09fabb70b4fd/Icon/icon.jpg",
                    "https://kurayami.vercel.app/app"
                ];
                
                // Local Storage - Table
                const localStorageSection = document.createElement("div");
                localStorageSection.className = "kurayami-section";
                localStorageSection.innerHTML = `<div class="kurayami-section-title">Local Storage</div>`;
                
                if (localStorage.length > 0) {
                    const table = document.createElement("table");
                    table.className = "kurayami-table";
                    table.innerHTML = `
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    `;
                    
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        const value = localStorage.getItem(key);
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${key}</td>
                            <td>${value}</td>
                        `;
                        table.appendChild(row);
                    }
                    localStorageSection.appendChild(table);
                } else {
                    localStorageSection.innerHTML += "<div style='color:#939293;'>No local storage items</div>";
                }
                resourcesContainer.appendChild(localStorageSection);
                
                // Cookies - Table
                const cookiesSection = document.createElement("div");
                cookiesSection.className = "kurayami-section";
                cookiesSection.innerHTML = `<div class="kurayami-section-title">Cookies</div>`;
                
                if (document.cookie) {
                    const table = document.createElement("table");
                    table.className = "kurayami-table";
                    table.innerHTML = `
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    `;
                    
                    document.cookie.split(';').forEach(cookie => {
                        const [name, value] = cookie.split('=').map(c => c.trim());
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${name}</td>
                            <td>${value}</td>
                        `;
                        table.appendChild(row);
                    });
                    cookiesSection.appendChild(table);
                } else {
                    cookiesSection.innerHTML += "<div style='color:#939293;'>No cookies</div>";
                }
                resourcesContainer.appendChild(cookiesSection);
                
                // Stylesheets - Box
                const stylesheetsSection = document.createElement("div");
                stylesheetsSection.className = "kurayami-resource-box";
                stylesheetsSection.innerHTML = `<div class="kurayami-resource-header">Stylesheets</div>`;
                
                const stylesheetsContent = document.createElement("div");
                const stylesheets = [...document.querySelectorAll("link[rel=stylesheet]")].filter(link => 
                    !excludeUrls.includes(link.href)
                );
                if (stylesheets.length > 0) {
                    stylesheets.forEach(link => {
                        const urlElement = document.createElement("a");
                        urlElement.href = link.href;
                        urlElement.target = "_blank";
                        urlElement.className = "kurayami-resource-url";
                        urlElement.textContent = link.href;
                        stylesheetsContent.appendChild(urlElement);
                    });
                    stylesheetsSection.appendChild(stylesheetsContent);
                } else {
                    stylesheetsSection.innerHTML += "<div style='color:#939293;'>No external stylesheets</div>";
                }
                resourcesContainer.appendChild(stylesheetsSection);
                
                // Scripts - Box
                const scriptsSection = document.createElement("div");
                scriptsSection.className = "kurayami-resource-box";
                scriptsSection.innerHTML = `<div class="kurayami-resource-header">Scripts</div>`;
                
                const scriptsContent = document.createElement("div");
                const scripts = [...document.querySelectorAll("script[src]")].filter(script => 
                    !excludeUrls.includes(script.src)
                );
                if (scripts.length > 0) {
                    scripts.forEach(script => {
                        const urlElement = document.createElement("a");
                        urlElement.href = script.src;
                        urlElement.target = "_blank";
                        urlElement.className = "kurayami-resource-url";
                        urlElement.textContent = script.src;
                        scriptsContent.appendChild(urlElement);
                    });
                    scriptsSection.appendChild(scriptsContent);
                } else {
                    scriptsSection.innerHTML += "<div style='color:#939293;'>No external scripts</div>";
                }
                resourcesContainer.appendChild(scriptsSection);
                
                // Iframes - Box
                const iframesSection = document.createElement("div");
                iframesSection.className = "kurayami-resource-box";
                iframesSection.innerHTML = `<div class="kurayami-resource-header">Iframes</div>`;
                
                const iframesContent = document.createElement("div");
                const iframes = [...document.querySelectorAll("iframe[src]")].filter(iframe => 
                    !excludeUrls.includes(iframe.src)
                );
                if (iframes.length > 0) {
                    iframes.forEach(iframe => {
                        const urlElement = document.createElement("a");
                        urlElement.href = iframe.src;
                        urlElement.target = "_blank";
                        urlElement.className = "kurayami-resource-url";
                        urlElement.textContent = iframe.src;
                        iframesContent.appendChild(urlElement);
                    });
                    iframesSection.appendChild(iframesContent);
                } else {
                    iframesSection.innerHTML += "<div style='color:#939293;'>No iframes</div>";
                }
                resourcesContainer.appendChild(iframesSection);
                
                // Images - Box with 3-column grid
                const imagesSection = document.createElement("div");
                imagesSection.className = "kurayami-resource-box";
                imagesSection.innerHTML = `<div class="kurayami-resource-header">Images</div>`;
                
                const imagesGrid = document.createElement("div");
                imagesGrid.className = "kurayami-image-grid";
                const images = [...document.querySelectorAll("img[src]")].filter(img => 
                    !excludeUrls.includes(img.src)
                );
                if (images.length > 0) {
                    images.forEach(img => {
                        const imageItem = document.createElement("div");
                        imageItem.className = "kurayami-image-item";
                        
                        const imgPreview = document.createElement("img");
                        imgPreview.src = img.src;
                        imgPreview.className = "kurayami-image-preview";
                        
                        const urlElement = document.createElement("a");
                        urlElement.href = img.src;
                        urlElement.target = "_blank";
                        urlElement.className = "kurayami-resource-url";
                        urlElement.textContent = img.src;
                        
                        imageItem.appendChild(imgPreview);
                        imageItem.appendChild(urlElement);
                        imagesGrid.appendChild(imageItem);
                    });
                    imagesSection.appendChild(imagesGrid);
                } else {
                    imagesSection.innerHTML += "<div style='color:#939293;'>No external images</div>";
                }
                resourcesContainer.appendChild(imagesSection);
                
                tabContents["Resources"] = resourcesContainer;

                // Network Tab - Table
                const networkContainer = document.createElement("div");
                
                const networkTable = document.createElement("table");
                networkTable.className = "kurayami-network-table";
                networkTable.innerHTML = `
                    <tr>
                        <th>Method</th>
                        <th>Status</th>
                        <th>URL</th>
                        <th>Time</th>
                    </tr>
                `;
                
                // Store original fetch and XHR methods
                const originalFetch = window.fetch;
                const originalXHROpen = XMLHttpRequest.prototype.open;
                const originalXRHSend = XMLHttpRequest.prototype.send;
                
                const networkRequests = [];
                
                // Override fetch to capture requests
                window.fetch = function(...args) {
                    const requestTime = new Date();
                    const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
                    const requestMethod = args[0] instanceof Request ? args[0].method : (args[1]?.method || 'GET');
                    
                    return originalFetch.apply(this, args).then(response => {
                        const responseClone = response.clone();
                        responseClone.text().then(text => {
                            networkRequests.push({
                                url: requestUrl,
                                method: requestMethod,
                                status: response.status,
                                statusText: response.statusText,
                                time: requestTime,
                                response: text
                            });
                            
                            updateNetworkTable();
                        });
                        return response;
                    }).catch(error => {
                        networkRequests.push({
                            url: requestUrl,
                            method: requestMethod,
                            status: 'Error',
                            statusText: error.message,
                            time: requestTime,
                            response: ''
                        });
                        
                        updateNetworkTable();
                        throw error;
                    });
                };
                
                // Override XMLHttpRequest to capture requests
                XMLHttpRequest.prototype.open = function(...args) {
                    this._method = args[0];
                    this._url = args[1];
                    return originalXHROpen.apply(this, args);
                };
                
                XMLHttpRequest.prototype.send = function(...args) {
                    const requestTime = new Date();
                    const xhr = this;
                    
                    xhr.addEventListener('load', function() {
                        networkRequests.push({
                            url: xhr._url,
                            method: xhr._method,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            time: requestTime,
                            response: xhr.responseText
                        });
                        
                        updateNetworkTable();
                    });
                    
                    xhr.addEventListener('error', function() {
                        networkRequests.push({
                            url: xhr._url,
                            method: xhr._method,
                            status: 'Error',
                            statusText: 'Network Error',
                            time: requestTime,
                            response: ''
                        });
                        
                        updateNetworkTable();
                    });
                    
                    return originalXRHSend.apply(this, args);
                };
                
                function updateNetworkTable() {
                    // Clear existing rows except header
                    while (networkTable.rows.length > 1) {
                        networkTable.deleteRow(1);
                    }
                    
                    if (networkRequests.length === 0) {
                        const row = networkTable.insertRow();
                        const cell = row.insertCell();
                        cell.colSpan = 4;
                        cell.textContent = "No network requests captured yet";
                        cell.style.color = "#939293";
                        cell.style.textAlign = "center";
                        cell.style.padding = "15px";
                        return;
                    }
                    
                    networkRequests.forEach((request) => {
                        const row = networkTable.insertRow();
                        
                        const methodCell = row.insertCell();
                        methodCell.textContent = request.method;
                        
                        const statusCell = row.insertCell();
                        statusCell.textContent = request.status;
                        statusCell.style.color = request.status === 200 ? '#A9DC76' : '#FF6188';
                        
                        const urlCell = row.insertCell();
                        urlCell.textContent = request.url;
                        
                        const timeCell = row.insertCell();
                        timeCell.textContent = request.time.toLocaleTimeString();
                        
                        row.addEventListener("click", () => {
                            const modal = document.createElement("div");
                            modal.className = "kurayami-modal";
                            
                            const modalContent = document.createElement("div");
                            modalContent.className = "kurayami-modal-content";
                            
                            modalContent.innerHTML = `
                                <h3 style="color:#FFD866; margin-bottom:15px;">${request.method} ${request.url}</h3>
                                <div style="color:${request.status === 200 ? '#A9DC76' : '#FF6188'}; margin-bottom:10px;">Status: ${request.status} ${request.statusText}</div>
                                <div style="color:#939293; margin-bottom:15px;">Time: ${request.time.toLocaleString()}</div>
                                <h4 style="color:#FFD866; margin-bottom:10px;">Response:</h4>
                                <pre style="color:#FCFCFA; background:#2D2A2E; padding:12px; overflow:auto; max-height:300px; font-size:12px; border:1px solid #403E41;">${request.response}</pre>
                                <button class="kurayami-close-btn">Close</button>
                            `;
                            
                            modalContent.querySelector(".kurayami-close-btn").addEventListener("click", () => {
                                document.body.removeChild(modal);
                            });
                            
                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);
                        });
                    });
                }
                
                updateNetworkTable();
                networkContainer.appendChild(networkTable);
                tabContents["Network"] = networkContainer;

                // Info Tab - Multiple sections with tables
                const info = document.createElement("div");
                
                // Location Info - Table
                const locationSection = document.createElement("div");
                locationSection.className = "kurayami-section";
                locationSection.innerHTML = `<div class="kurayami-section-title">Location</div>`;
                
                const locationTable = document.createElement("table");
                locationTable.className = "kurayami-table";
                locationTable.innerHTML = `
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Page Title</td>
                        <td>${document.title}</td>
                    </tr>
                    <tr>
                        <td>URL</td>
                        <td>${location.href}</td>
                    </tr>
                    <tr>
                        <td>Host</td>
                        <td>${location.host}</td>
                    </tr>
                    <tr>
                        <td>Protocol</td>
                        <td>${location.protocol}</td>
                    </tr>
                    <tr>
                        <td>Path</td>
                        <td>${location.pathname}</td>
                    </tr>
                    <tr>
                        <td>Loaded</td>
                        <td>${new Date().toLocaleString()}</td>
                    </tr>
                `;
                locationSection.appendChild(locationTable);
                info.appendChild(locationSection);
                
                // User Agent Info - Table
                const userAgentSection = document.createElement("div");
                userAgentSection.className = "kurayami-section";
                userAgentSection.innerHTML = `<div class="kurayami-section-title">User Agent</div>`;
                
                const userAgentTable = document.createElement("table");
                userAgentTable.className = "kurayami-table";
                userAgentTable.innerHTML = `
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>User Agent</td>
                        <td>${navigator.userAgent}</td>
                    </tr>
                    <tr>
                        <td>Language</td>
                        <td>${navigator.language}</td>
                    </tr>
                    <tr>
                        <td>Cookies Enabled</td>
                        <td>${navigator.cookieEnabled ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <td>Online</td>
                        <td>${navigator.onLine ? 'Yes' : 'No'}</td>
                    </tr>
                `;
                userAgentSection.appendChild(userAgentTable);
                info.appendChild(userAgentSection);
                
                // Device Info - Table
                const deviceSection = document.createElement("div");
                deviceSection.className = "kurayami-section";
                deviceSection.innerHTML = `<div class="kurayami-section-title">Device</div>`;
                
                const deviceTable = document.createElement("table");
                deviceTable.className = "kurayami-table";
                deviceTable.innerHTML = `
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Screen Size</td>
                        <td>${screen.width}x${screen.height}</td>
                    </tr>
                    <tr>
                        <td>Viewport Size</td>
                        <td>${window.innerWidth}x${window.innerHeight}</td>
                    </tr>
                    <tr>
                        <td>Color Depth</td>
                        <td>${screen.colorDepth} bit</td>
                    </tr>
                    <tr>
                        <td>Pixel Ratio</td>
                        <td>${window.devicePixelRatio || 'N/A'}</td>
                    </tr>
                `;
                deviceSection.appendChild(deviceTable);
                info.appendChild(deviceSection);
                
                // System Info - Table
                const systemSection = document.createElement("div");
                systemSection.className = "kurayami-section";
                systemSection.innerHTML = `<div class="kurayami-section-title">System</div>`;
                
                const systemTable = document.createElement("table");
                systemTable.className = "kurayami-table";
                let systemInfoHTML = `
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Platform</td>
                        <td>${navigator.platform}</td>
                    </tr>
                `;
                
                if (navigator.connection) {
                    systemInfoHTML += `
                        <tr>
                            <td>Connection Type</td>
                            <td>${navigator.connection.effectiveType}</td>
                        </tr>
                    `;
                }
                
                if (navigator.deviceMemory) {
                    systemInfoHTML += `
                        <tr>
                            <td>Device Memory</td>
                            <td>${navigator.deviceMemory} GB</td>
                        </tr>
                    `;
                }
                
                if (navigator.hardwareConcurrency) {
                    systemInfoHTML += `
                        <tr>
                            <td>CPU Cores</td>
                            <td>${navigator.hardwareConcurrency}</td>
                        </tr>
                    `;
                }
                
                systemTable.innerHTML = systemInfoHTML;
                systemSection.appendChild(systemTable);
                info.appendChild(systemSection);
                
                // About Info - Table
                const aboutSection = document.createElement("div");
                aboutSection.className = "kurayami-section";
                aboutSection.innerHTML = `<div class="kurayami-section-title">About</div>`;
                
                const aboutTable = document.createElement("table");
                aboutTable.className = "kurayami-table";
                aboutTable.innerHTML = `
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>Kurayami Miryoku</td>
                    </tr>
                    <tr>
                        <td>Version</td>
                        <td>1.5</td>
                    </tr>
                    <tr>
                        <td>Creator</td>
                        <td>Starexx</td>
                    </tr>
                `;
                aboutSection.appendChild(aboutTable);
                info.appendChild(aboutSection);
              
                tabContents["Info"] = info;

                // Copy button
                copyBtn = document.createElement("button");
                copyBtn.className = "kurayami-copy-btn";
                copyBtn.textContent = "Copy Source";
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(html);
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy Source";
                    }, 2000);
                };

                // Assemble panel
                sourcePanel.append(navBar, contentArea, copyBtn);
                document.body.appendChild(sourcePanel);
                switchTab("Console");

                // Swipe functionality
                let touchStartX = 0;
                let touchEndX = 0;
                
                contentArea.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                }, false);
                
                contentArea.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                }, false);
                
                contentArea.addEventListener('mousedown', e => {
                    touchStartX = e.screenX;
                    document.addEventListener('mouseup', handleMouseUp);
                });
                
                function handleMouseUp(e) {
                    touchEndX = e.screenX;
                    handleSwipe();
                    document.removeEventListener('mouseup', handleMouseUp);
                }
                
                function handleSwipe() {
                    if (Math.abs(touchEndX - touchStartX) < 50) return;
                    
                    const currentIndex = tabs.indexOf(currentTab);
                    if (touchEndX < touchStartX) {
                        if (currentIndex < tabs.length - 1) {
                            switchTab(tabs[currentIndex + 1], 'left');
                        }
                    } else {
                        if (currentIndex > 0) {
                            switchTab(tabs[currentIndex - 1], 'right');
                        }
                    }
                }

                // Animate panel opening
                requestAnimationFrame(() => {
                    sourcePanel.style.transform = "translateY(0)";
                });

                // Add line numbers plugin for Prism
                if (!document.querySelector(".line-numbers")) {
                    const lineNumbersStyle = document.createElement("style");
                    lineNumbersStyle.textContent = `
                        .line-numbers .line-numbers-rows {
                            position: absolute;
                            pointer-events: none;
                            top: 0;
                            font-size: 100%;
                            left: -3.8em;
                            width: 3em;
                            letter-spacing: -1px;
                            border-right: 1px solid #403E41 !important;
                        }
                        
                        .line-numbers-rows > span {
                            display: block;
                            counter-increment: linenumber;
                        }
                        
                        .line-numbers-rows > span:before {
                            content: counter(linenumber);
                            color: #939293 !important;
                            display: block;
                            padding-right: 0.8em;
                            text-align: right;
                        }
                    `;
                    document.head.appendChild(lineNumbersStyle);
                }

                Prism.highlightAll();
            });
    }

    // Event listeners
    btn.addEventListener("click", toggleSourceCode);
    btn.addEventListener("contextmenu", e => e.preventDefault());

    // Add button to page
    document.body.appendChild(btn);
})();
