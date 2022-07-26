(function() {

    function addButton() {

        var e;

        if ((/\/commit\//.test(location.href) || /\/compare\//.test(location.href)) && (e = document.getElementById('toc'))) {

            var r = e.querySelector('.GithubCommitDiffButton');

            if (r) {
                r.parentElement.removeChild(r);
            }

            var b = e.querySelector('.toc-diff-stats');

            const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            s.classList.add('octicon', 'octicon-diff');
            s.setAttributeNS(null, 'height', 16);
            s.setAttributeNS(null, 'width', 14);
            s.setAttributeNS(null, 'viewBox', '0 0 14 16');

            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            p.setAttributeNS(null, 'd', 'M6 7h2v1H6v2h-1V8H3v-1h2V5h1v2zM3 13h5v-1H3v1z m4.5-11l3.5 3.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h6.5z m2.5 4L7 3H1v12h9V6zM8.5 0S3 0 3 0v1h5l4 4v8h1V4.5L8.5 0z');
            
            s.appendChild(p);

            var a = document.createElement('a');

            a.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-n');
            a.setAttribute('href', getPatchOrDiffHref('diff'));
            a.setAttribute('rel', 'nofollow');
            a.setAttribute('aria-label', 'Show commit diff.\r\nHold Shift to open commit patch.')
            a.appendChild(s);
            a.appendChild(document.createTextNode(' Diff'));

            var g = document.createElement('div');

            g.classList.add('GithubCommitDiffButton', 'float-right');
            g.style.margin = '0 10px 0 0';
            g.appendChild(a);

            b.parentNode.insertBefore(g, b);

            a.addEventListener('mousedown', mousedownEvent, false);

            a.addEventListener('mouseout', function() {
                a.setAttribute('href', getPatchOrDiffHref('diff'));
            }, false);

        } else if (/\/pull\/\d*\/(files|commits)/.test(location.href) && (e = document.querySelector('#files_bucket .pr-toolbar .diffbar > .float-right'))) {

            var r = e.querySelector('.GithubCommitDiffButton');

            if (r) {
                r.parentElement.removeChild(r);
            }

            const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            s.classList.add('octicon', 'octicon-diff');
            s.setAttributeNS(null, 'height', 16);
            s.setAttributeNS(null, 'width', 14);
            s.setAttributeNS(null, 'viewBox', '0 0 14 16');

            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            p.setAttributeNS(null, 'd', 'M6 7h2v1H6v2h-1V8H3v-1h2V5h1v2zM3 13h5v-1H3v1z m4.5-11l3.5 3.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h6.5z m2.5 4L7 3H1v12h9V6zM8.5 0S3 0 3 0v1h5l4 4v8h1V4.5L8.5 0z');
            s.appendChild(p);

            var a = document.createElement('a');

            a.classList.add('btn', 'btn-sm', 'btn-outline', 'tooltipped', 'tooltipped-s');
            a.setAttribute('href', getPatchOrDiffHref('diff'));
            a.setAttribute('rel', 'nofollow');
            a.setAttribute('aria-label', 'Mostrar Diff do Commit.\r\nSegure Shift para abrir o Commit Patch.');
            a.appendChild(s);
            a.appendChild(document.createTextNode(' Diff'));

            var g = document.createElement('div');

            g.classList.add('GithubCommitDiffButton', 'diffbar-item');
            g.appendChild(a);

            e.insertBefore(g, e.firstChild);

            a.addEventListener('mousedown', mousedownEvent, false);

            a.addEventListener('mouseout', function() {
                a.setAttribute('href', getPatchOrDiffHref('diff'));
            }, false);
        }
    }

    function mousedownEvent(e) {

        if (e.shiftKey) {
            var patch = getPatchOrDiffHref('patch');

            e.preventDefault();
            this.setAttribute('href', patch);

            if (e.which === 1) { // left click
                location.href = patch;
                this.parentElement.removeChild(this);
            } else if (e.which === 2) {
                window.open(patch, 'GithubCommitDiff');
            }
        } else {
            this.setAttribute('href', getPatchOrDiffHref('diff'));
        }

    }

    function getPatchOrDiffHref(type) {
        return (document.querySelector('link[type="text/plain+' + type + '"]') || document.querySelector('link[type="text/x-' + type + '"]') || {
            href: location.href + '.' + type
        }).href;
    }

    // init
    addButton();

    // pjax
    document.addEventListener('pjax:end', addButton);

})();
