(function () {
    let isDragging = false, offsetX, offsetY, sourcePanel, copyBtn;

    if (!document.querySelector("#prismjs")) {
        let prismScript = document.createElement("script");
        prismScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
        prismScript.id = "prismjs";
        document.head.appendChild(prismScript);

        let prismCSS = document.createElement("link");
        prismCSS.rel = "stylesheet";
        prismCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        document.head.appendChild(prismCSS);
    }

    let btn = document.createElement("img");
    btn.src = "https://github.com/starexxx.png";
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
    `;
    btn.draggable = false;

    function startDrag(e) {
        isDragging = true;
        let event = e.type.includes("touch") ? e.touches[0] : e;
        offsetX = event.clientX - btn.getBoundingClientRect().left;
        offsetY = event.clientY - btn.getBoundingClientRect().top;
        btn.style.transition = "none";
        btn.style.opacity = "1";
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
        btn.style.opacity = "0.7";
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
                    background: #111;
                    color: white;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                    font-family: monospace;
                `;
                sourcePanel.classList.add("show");

                const header = document.createElement("div");
                header.innerText = "Starexx";
                header.style = `
                    text-align: center;
                    padding: 10px;
                    font-size: 14px;
                    font-weight: bold;
                    background: #1a1a1a;
                    border-bottom: none;
                `;

                const navBar = document.createElement("div");
                navBar.style = `
                    display: flex;
                    background: #1a1a1a;
                    border-bottom: 1px solid #333;
                    justify-content: space-around;
                    font-size: 12px;
                `;

                const tabs = ["Source", "Console", "Resources", "Info"];
                let currentTab = "Source";
                const tabContents = {};

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
                    `;
                    btn.onclick = () => switchTab(tab);
                    navBar.appendChild(btn);
                });

                const contentArea = document.createElement("div");
                contentArea.style = `
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    font-size: 11px;
                `;

                function switchTab(tab) {
                    currentTab = tab;
                    contentArea.innerHTML = "";
                    contentArea.appendChild(tabContents[tab]);
                    Prism.highlightAll();
                    copyBtn.style.display = tab === "Source" ? "block" : "none";
                }

                const pre = document.createElement("pre");
                const code = document.createElement("code");
                code.className = "language-html";
                code.textContent = html;
                pre.appendChild(code);
                pre.style = `margin:0; padding:0; white-space:pre-wrap;`;
                tabContents["Source"] = pre;

                const jsExec = document.createElement("div");
                const input = document.createElement("textarea");
                input.style = `
                    width: 100%;
                    height: 60px;
                    background: #111;
                    color: #0f0;
                    border: none;
                    border-radius: 0px;
                    font-size: 11px;
                    outline: none;
                    margin-bottom: 5px;
                `;
                const run = document.createElement("button");
                run.innerText = "Execute";
                run.style = `
                    padding: 5px 10px;
                    background: transparent;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                `;
                const out = document.createElement("div");
                out.style = `margin-top:5px;color:#0f0;font-size:11px;`;
                run.onclick = () => {
                    try {
                        out.innerText = eval(input.value);
                    } catch (e) {
                        out.innerText = e.message;
                    }
                };
                jsExec.append(input, run, out);
                tabContents["Console"] = jsExec;

                const resBox = document.createElement("div");
                const resources = [
                    ...document.querySelectorAll("script[src]"),
                    ...document.querySelectorAll("link[rel=stylesheet]"),
                    ...document.querySelectorAll("img[src]")
                ];
                resources.forEach(r => {
                    const item = document.createElement("div");
                    item.innerText = r.src || r.href;
                    item.style = `margin-bottom:3px;color:#aaa;`;
                    resBox.appendChild(item);
                });
                tabContents["Resources"] = resBox;

                const info = document.createElement("div");
                info.innerHTML = `
                    <b>Title:</b> ${document.title}<br>
                    <b>URL:</b> ${location.href}<br>
                    <b>User Agent:</b> ${navigator.userAgent}
                `;
                tabContents["Info"] = info;

                copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy";
                copyBtn.style = `
                    position: absolute;
                    top: 80px;
                    right: 15px;
                    background: #111;
                    color: #fff;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    z-index: 10001;
                `;
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(html);
                    copyBtn.innerText = "✓";
                    setTimeout(() => (copyBtn.innerText = "Copied"), 2000);
                };

                sourcePanel.append(header, navBar, contentArea, copyBtn);
                document.body.appendChild(sourcePanel);
                switchTab("Source");

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
