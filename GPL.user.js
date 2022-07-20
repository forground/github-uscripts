(function () {

	String.format = function (string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);

		return string.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function addLink() {
		if (document.getElementById("GithubPagesLinker")) {
			return;
		}

		var meta = document.querySelector('main h1');

		if (!meta) {
			return;
		}

		var branchSelector = document.querySelector('#branch-select-menu');

		if (!branchSelector) {
			return;
		}

		var branch = document.querySelector('.SelectMenu-item[href$="/tree/gh-pages"]');

		if (branch) {
			createLink(branch);
		} else {
			const observer = new MutationObserver(function () {
				var branch2 = document.querySelector('.SelectMenu-item[href$="/tree/gh-pages"]');

				if (branch2) {
					observer.disconnect();
					createLink(branch2);
				}
			});

			observer.observe(branchSelector, { subtree: true, childList: true });

			var dropdown = branchSelector.querySelector('ref-selector');

			window.setTimeout(function () {
				dropdown.dispatchEvent(new CustomEvent('container-mouseover', { bubbles: true }));
			}, 100);
		}

		function createLink(branch2) {
			var tree = branch2.getAttribute("href").split("/"); // `/{user}/{repo}/tree/gh-pages`;
			var url = String.format("{0}//{1}.github.io/{2}/", tree[0], tree[3], tree[4]);

			var div = document.createElement("small");
			div.id = "GithubPagesLinker";
			meta.parentNode.insertBefore(div, meta.nextSibling);

			var img = document.createElement("img");

			img.setAttribute("src", "https://github.githubassets.com/images/icons/emoji/octocat.png");
			img.setAttribute("align", "absmiddle");
			img.classList.add("emoji");
			img.style.height = "16px";
			img.style.width = "16px";

			div.appendChild(img);

			div.appendChild(document.createTextNode(" "));

			var a = document.createElement("a");

			a.setAttribute("href", "{https}://pages.github.com");
			a.setAttribute("title", "More info about gh-pages...");
			a.style.color = "inherit";
			a.appendChild(document.createTextNode("Github Pages"));

			div.appendChild(a);

			div.appendChild(document.createTextNode(": "));

			var aa = document.createElement("a");

			aa.setAttribute("href", url);
			aa.appendChild(document.createTextNode(url));
            
			div.appendChild(aa);
		}
	}

	// init
	addLink();

	// pjax
	document.addEventListener('pjax:end', addLink);

})();
