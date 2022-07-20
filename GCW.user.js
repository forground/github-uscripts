(function () {

    function addButton() {
        var e;

        if ((/\/commit\//.test(location.href) || /\/compare\//.test(location.href)) && (e = document.getElementById('toc'))) {

            var r = e.querySelector('.GithubCommitWhitespaceButton');

            if (r) {
                r.parentElement.removeChild(r);
            }

            var on = /w=/.test(location.search);
            var b = e.querySelector('.toc-diff-stats');
            var a = document.createElement('a');

            a.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-n');

            if (on) {
                a.classList.add('selected');
            }

            a.setAttribute('href', url(on));
            a.setAttribute('rel', 'nofollow');
            a.setAttribute('aria-label', on ? 'Mostra whitespace de Commit' : 'Ocultar whitespace de Commit');
            a.appendChild(document.createElement('\u2423'));

            var g = document.createElement('div');

            g.classList.add('GithubCommitWhitespaceButton', 'float-right');
            g.style.margin = '0 10px 0 0';
            g.appendChild(a);

            b.parentNode.insertBefore(g, b);

        } else if (/\/pull\/\d*\/(files|commits)/.test(location.href) && (e = document.querySelector('#files_bucket .pr-toolbar .diffbar > .pr-review-tools'))) {

            var r = e.querySelector('.GithubCommitWhitespaceButton');

            if (r) {
                r.parentElement.removeChild(r);
            }

            var on = /w=/.test(location.search);

            var a = document.createElement('a');

            a.classList.add('btn', 'btn-sm', 'btn-outline', 'tooltipped', 'tooltipped-s');
            a.setAttribute('href', url(on));
            a.setAttribute('rel', 'nofollow');
            a.setAttribute('aria-label', on ? 'Mostra whitespace de Commit' : 'Ocultar whitespace de Commit');
            a.appendChild(document.createTextNode('\u2423'));

            var g = document.createElement('div');

            g.classList.add('GithubCommitWhitespaceButton', 'diffbar-item');
            g.appendChild(a);

            e.insertBefore(g, e.firstChild);
        }
    }

    function url(on) {
        var searches = location.search.replace(/^\?/, '').split('&').filter(function(item) {
            return item && !/w=.*/.test(item);
        })

        if (!on) {
            searches.push('w=1');
        }

        return location.href.replace(location.search, '').replace(location.hash, '') + (searches.length > 0 ? '?' + searches.join('&') : '') + location.hash;
    }

    // init
    addButton();

    // pjax
    document.addEventListener('pjax:end', addButton);

})();
