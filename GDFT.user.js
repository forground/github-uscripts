(() => {
    "use strict";

    const icon =
        `<svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="10" height="6.5" viewBox="0 0 10 6.5">
            <path d="M0 1.5L1.5 0l3.5 3.7L8.5.0 10 1.5 5 6.5 0 1.5z"/>
        </svg>`;

    function addFileToggle() {
        const files = $$("#files .file-actions");
        const button = document.createElement("button");

        let updated = false;

        button.type = "button";
        button.className = "ghd-file-toggle btn btn-sm tooltipped tooltipped-n";
        button.setAttribute("aria-label", "Click to Expand or Collapse file");
        button.setAttribute("tabindex", "-1");
        button.innerHTML = icon;

        files.forEach(el => {
            if (!$(".ghd-file-toggle", el)) {
                el.querySelector(".js-details-target").style.display = "none";
                el.appendChild(button.cloneNode(true));
                updated = true;
            }
        });

        if (updated && files.length) {
            if ((GM_getValue("accordion") || "").startsWith("t")) {
                toggleFile({
                    target: $(".ghd-file-toggle")
                }, "init");
            }
        }
    }
   
    function toggleSibs(target, state) {
        const isCollapsed = state,
            toggles = $$(".file");
        let el,
            indx = toggles.length;
        while (indx--) {
            el = toggles[indx];
            if (el !== target) {
                el.classList.toggle("Details--on", isCollapsed);
            }
        }
    }
   
    function toggleFile(event, init) {
        const accordion = GM_getValue("accordion"),
            el = event.target.closest(".file");
        if (el && accordion) {
            if (!init) {
                el.classList.toggle("Details--on");
            }

            toggleSibs(el, false);
        } else if (el) {
            el.classList.toggle("Details--on");

            // shift+click
            if (event.shiftKey) {
                toggleSibs(el, el.classList.contains("Details--on"));
            }
        }
        document.activeElement.blur();

        if (el.classList.contains("Details--on")) {
            location.hash = el.id;
        }
    }
   
    function addBindings() {
        $("body").addEventListener("click", event => {
            const target = event.target;

            if (target && target.classList.contains("ghd-file-toggle")) {
                toggleFile(event);
                return false;
            }
        });
    }
   
    function $(str, el) {
        return (el || document).querySelector(str);
    }
   
    function $$(str, el) {
        return [...(el || document).querySelectorAll(str)];
    }
   
    // não inicializar se o GitHub Dark está ativo
    if (!$("#ghd-menu")) {
        GM_addStyle(`
            .Details--on .ghd-file-toggle svg {
                -webkit-transform:rotate(90deg); transform:rotate(90deg);
            }
            .ghd-file-toggle svg.octicon {
                pointer-events: none;
                vertical-align: middle;
            }
        `);
   
        document.addEventListener("ghmo:container", addFileToggle);
        document.addEventListener("ghmo:diff", addFileToggle);
   
        // adiciona opções GM
        GM_registerMenuCommand("GitHub Diff File Toggle", () => {
            let result = `${GM_getValue("accordion") || false}`;

            const val = prompt("Accordion Mode? (true/false):", result);

            if (val) {
                result = val.startsWith("t");
                GM_setValue("accordion", result);
            }
        });
   
        addBindings();
        
        addFileToggle();
    }
})();
