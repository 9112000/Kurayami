
    (function() {
    let isDragging = false, offsetX, offsetY, sourcePanel, copyBtn, currentTab = "Info", tabButtons = [];
    if (!document.querySelector("#prismjs")) {
        let prismScript = document.createElement("script");
        prismScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
        prismScript.id = "prismjs";
        document.head.appendChild(prismScript);
        let prismCSS = document.createElement("link");
        prismCSS.rel = "stylesheet";
        prismCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        document.head.appendChild(prismCSS);
        let materialIcons = document.createElement("link");
        materialIcons.rel = "stylesheet";
        materialIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
        document.head.appendChild(materialIcons);
        let interFont = document.createElement("link");
        interFont.rel = "stylesheet";
        interFont.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap";
        document.head.appendChild(interFont);
    }

    let style = document.createElement("style");
    style.textContent = `
        * {
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            user-select: none;
        }
    `;
    document.head.appendChild(style);

    let btn = document.createElement("img");
    btn.src = "https://raw.githubusercontent.com/starexxx/Kurayami/7b2b2c3f1aee1517d5ab6c22e01b09fabb70b4fd/Icon/icon.jpg";
    btn.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        cursor: grab;
        border-radius: 30%;
        z-index: 10000;
        transition: opacity 0.2s ease;
        opacity: 0.3;
        box-shadow: none;
        font-family: 'Inter', sans-serif;
    `;
    btn.draggable = false;

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
        btn.style.left = `${event.clientX - offsetX}px`;
        btn.style.top = `${event.clientY - offsetY}px`;
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

    function toggleSourceCode() {
        if (isDragging) return;
        if (sourcePanel) {
            sourcePanel.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(sourcePanel);
                sourcePanel = null;
            }, 300);
            return;
        }

        fetch(document.location.href)
            .then(res => res.text())
            .then(html => {
                sourcePanel = document.createElement("div");
                sourcePanel.style = `
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    border: none;
                    background: #1a1a1a;
                    color: white;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                    font-family: 'Inter', monospace;
                `;
                sourcePanel.classList.add("show");

                const header = document.createElement("div");
                header.innerText = "";
                header.style = `
                    text-align: center;
                    padding: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    background: #111;
                    border: none;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                `;

                const navBar = document.createElement("div");
                navBar.style = `
                    display: flex;
                    background: #111;
                    border-bottom: 1px solid #333;
                    justify-content: space-around;
                    font-size: 12px;
                    font-family: 'Inter', sans-serif;
                `;

                const tabs = ["Info", "Source", "Console", "Resources"];
                tabButtons = [];

                tabs.forEach(tab => {
                    let btn = document.createElement("button");
                    btn.innerText = tab;
                    btn.style = `
                        flex: 1;
                        padding: 8px;
                        background: none;
                        color: #ccc;
                        border: none;
                        cursor: pointer;
                        position: relative;
                        outline: none;
                        font-family: 'Inter', sans-serif;
                    `;
                    if (tab === currentTab) {
                        btn.style.color = "#fff";
                        btn.style.fontWeight = "bold";
                        btn.innerHTML += `<div style="position:absolute;bottom:0;left:25%;width:50%;height:2px;background:#34C759;"></div>`;
                    }
                    btn.onclick = () => switchTab(tab);
                    navBar.appendChild(btn);
                    tabButtons.push(btn);
                });

                const contentArea = document.createElement("div");
                contentArea.style = `
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    font-size: 11px;
                    background: #1a1a1a;
                    position: relative;
                    border: none;
                    font-family: 'Inter', monospace;
                `;

                function switchTab(tab, direction) {
                    currentTab = tab;
                    
                    tabButtons.forEach(btn => {
                        btn.style.color = "#ccc";
                        btn.style.fontWeight = "normal";
                        btn.innerHTML = btn.innerText;
                    });
                    
                    const activeBtn = tabButtons[tabs.indexOf(tab)];
                    activeBtn.style.color = "#fff";
                    activeBtn.style.fontWeight = "bold";
                    activeBtn.innerHTML += `<div style="position:absolute;bottom:0;left:25%;width:50%;height:2px;background:#34C759;"></div>`;

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

                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.className = "language-html";
                code.textContent = html;
                pre.appendChild(code);
                pre.style = `margin:0; padding:0; white-space:pre-wrap; background: transparent !important;`;
                tabContents = {"Source": pre};
                const jsExec = document.createElement("div");
                const inputContainer = document.createElement("div");
                inputContainer.style = `margin-bottom:10px;`;     
                const input = document.createElement("textarea");
                input.placeholder = "Javascript Console";
                input.style = `
                    width: 100%;
                    height: 60px;
                    background: #111;
                    color: #0f0;
                    border: none;
                    resize: none;
                    border-radius: 0px;
                    font-size: 12px;
                    outline: none;
                    margin-bottom: -30px;
                    padding: 8px;
                    font-family: 'Inter', monospace;
                `;
                
                const buttonContainer = document.createElement("div");
                buttonContainer.style = `display:flex; gap:8px; margin-bottom:1px;`;
                
                const run = document.createElement("button");
                run.innerHTML = `Execute`;
                run.style = `
                    padding: 6px 12px;
                    background: transparent;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    text-align: right;
                    border-radius: 0px;
                    font-size: 12px;
                    flex:1;
                    font-family: 'Inter', sans-serif;
                `;
                
                const out = document.createElement("div");
                out.style = `
                    color:#0f0;
                    font-size:12px;
                    white-space:pre-wrap;
                    background:#111;
                    padding:8px;
                    border-radius:0px;
                    border: none;
                    font-family:'Inter', monospace;
                    max-height:200px;
                    overflow-y:auto;
                `;
                
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
                        entry.style = `color:#0f0; margin-bottom:5px;`;
                        entry.textContent = args;
                        out.appendChild(entry);
                        out.scrollTop = out.scrollHeight;
                    };
                    
                    console.warn = function() {
                        originalConsole.warn.apply(console, arguments);
                        const args = Array.from(arguments).join(' ');
                        const entry = document.createElement("div");
                        entry.style = `color:#FFCC00; margin-bottom:5px;`;
                        entry.textContent = args;
                        out.appendChild(entry);
                        out.scrollTop = out.scrollHeight;
                    };
                    
                    console.error = function() {
                        originalConsole.error.apply(console, arguments);
                        const args = Array.from(arguments).join(' ');
                        const entry = document.createElement("div");
                        entry.style = `color:#FF3B30; margin-bottom:5px;`;
                        entry.textContent = args;
                        out.appendChild(entry);
                        out.scrollTop = out.scrollHeight;
                    };
                }
                
                captureConsole();
                
                run.onclick = () => {
                    try {
                        const code = input.value;
                        const result = eval(code);
                        const entry = document.createElement("div");
                        entry.style = `margin-bottom:10px;`;
                        entry.innerHTML = `
                            <div style="color:#34C759;">> ${code}</div>
                            <div style="color:#0f0;">${result !== undefined ? result : ''}</div>
                        `;
                        out.appendChild(entry);
                        out.scrollTop = out.scrollHeight;
                    } catch (e) {
                        const entry = document.createElement("div");
                        entry.style = `color:#FF3B30; margin-bottom:10px;`;
                        entry.textContent = `Error: ${e.message}`;
                        out.appendChild(entry);
                        out.scrollTop = out.scrollHeight;
                    }
                };
                
                buttonContainer.append(run);
                inputContainer.append(input, buttonContainer, out);
                jsExec.append(inputContainer);
                tabContents["Console"] = jsExec;

                const resBox = document.createElement("div");
                const resources = [
                    ...document.querySelectorAll("script[src]"),
                    ...document.querySelectorAll("link[rel=stylesheet]"),
                    ...document.querySelectorAll("img[src]"),
                    ...document.querySelectorAll("iframe[src]")
                ];
                resources.forEach(r => {
                    const container = document.createElement("div");
                    container.style = `margin-bottom:-15px; background:#111; padding:10px; border-radius:0px;`;
                    
                    const link = document.createElement("a");
                    link.innerText = r.src || r.href;
                    link.href = r.src || r.href;
                    link.target = "_blank";
                    link.style = `color:#aaa; text-decoration:underline; display:block;`;
                    
                    container.appendChild(link);
                    
                    if (r.tagName === 'IMG') {
                        const imgPreview = document.createElement("img");
                        imgPreview.src = r.src;
                        imgPreview.style = `max-width:100%; max-height:100px; display:block; margin-top:10px; border-radius:3px; border:1px solid #333;`;
                        container.appendChild(imgPreview);
                    }
                    else if (r.tagName === 'IFRAME') {
                        const iframeLabel = document.createElement("div");
                        iframeLabel.style = `color:#aaa; font-size:10px; margin-top:5px;`;
                        iframeLabel.textContent = "IFrame Content:";
                        container.appendChild(iframeLabel);
                    }
                    
                    resBox.appendChild(container);
                });
                tabContents["Resources"] = resBox;

                const info = document.createElement("div");
                info.style = `display:flex; flex-direction:column; gap:10px;`;
                
                const createInfoSection = (title, items) => {
                    const section = document.createElement("div");
                    section.style = `background:#111; padding:10px; border-radius:0px;`;
                    
                    const titleEl = document.createElement("div");
                    titleEl.style = `color:#34C759; font-weight:bold; margin-bottom:8px;`;
                    titleEl.textContent = title;
                    section.appendChild(titleEl);
                    
                    items.forEach(item => {
                        const row = document.createElement("div");
                        row.style = `margin-bottom:5px; display:flex;`;
                        
                        const label = document.createElement("div");
                        label.style = `color:#aaa; min-width:120px;`;
                        label.textContent = item.label;
                        
                        const value = document.createElement("div");
                        value.style = `color:#fff;`;
                        value.textContent = item.value;
                        
                        row.appendChild(label);
                        row.appendChild(value);
                        section.appendChild(row);
                    });
                    
                    return section;
                };
                
                info.appendChild(createInfoSection("Page Information", [
                    { label: "Title:", value: document.title },
                    { label: "URL:", value: location.href },
                    { label: "Loaded:", value: new Date().toLocaleString() }
                ]));
                
                info.appendChild(createInfoSection("Device Information", [
                    { label: "Screen:", value: `${screen.width}x${screen.height}` },
                    { label: "Viewport:", value: `${window.innerWidth}x${window.innerHeight}` },
                    { label: "Platform:", value: navigator.platform },
                    { label: "Language:", value: navigator.language }
                ]));
                
                info.appendChild(createInfoSection("Browser Information", [
                    { label: "User Agent:", value: navigator.userAgent },
                    { label: "Cookies:", value: navigator.cookieEnabled ? 'Enabled' : 'Disabled' },
                    { label: "Online:", value: navigator.onLine ? 'Yes' : 'No' }
                ]));            
                
                if (navigator.connection) {
                    info.appendChild(createInfoSection("Connection Information", [
                        { label: "Type:", value: navigator.connection.effectiveType },
                        { label: "Memory:", value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown' },
                        { label: "CPU Cores:", value: navigator.hardwareConcurrency || 'Unknown' }
                    ]));
                }
              
                info.appendChild(createInfoSection("About Software", [
                        { label: "Name:", value: "Kurayami Miryoku" },
                        { label: "Version:", value: "1.5" },
                        { label: "Creator:", value: "Starexx" }
                 ]));
              
                tabContents["Info"] = info;

                copyBtn = document.createElement("button");
                copyBtn.innerHTML = `<span class="material-icons" style="font-size:14px;vertical-align:middle">content_copy</span>`;
                copyBtn.style = `
                    position: absolute;
                    top: 75px;
                    right: 15px;
                    background: transparent;
                    color: #ccc;
                    border: none;
                    padding: 5px;
                    cursor: pointer;
                    z-index: 10001;
                    display: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(html);
                    copyBtn.innerHTML = `<span class="material-icons" style="font-size:14px;vertical-align:middle">done</span>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = `<span class="material-icons" style="font-size:14px;vertical-align:middle">content_copy</span>`;
                    }, 2000);
                };

                sourcePanel.append(header, navBar, contentArea, copyBtn);
                document.body.appendChild(sourcePanel);
                switchTab("Info");

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

                requestAnimationFrame(() => {
                    sourcePanel.style.transform = "translateY(0)";
                });

                Prism.highlightAll();
            });
    }

    btn.addEventListener("click", toggleSourceCode);
    btn.addEventListener("contextmenu", e => e.preventDefault());

    document.body.appendChild(btn);
})();
