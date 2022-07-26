(function () {

    String.format = function (string) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);
        return string.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== "undefined" ? args[number] : match;
        });
    };

    var turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        hr: '***'
    });
    turndownService.use(turndownPluginGfm.gfm);
    turndownService.use(turndownPluginGithubCodeSnippet);

    function getCommentTextarea(replyBtn) {
        var newComment = replyBtn;
        while (newComment && !newComment.classList.contains("js-quote-selection-container")) {
            newComment = newComment.parentNode;
        }

        var inlineComment = newComment.querySelector(".js-inline-comment-form-container");
		if (inlineComment) {
			inlineComment.classList.add("open");
		}

        var textareas = newComment.querySelectorAll(":scope > :not(.last-review-thread) .comment-form-textarea:not(.github-writer-ckeditor)");
		return textareas[textareas.length - 1];
    }

    function getCommentMarkdown(comment) {
		var commentText = "";

		var commentForm = comment.querySelector(".comment-form-textarea");
		if (commentForm) {
			commentText = commentForm.value;
		}

		// converter comentário HTML para Markdown
		if (!commentText) {
			var commentBody = comment.querySelector(".comment-body").cloneNode(true);

			Array.prototype.forEach.call(commentBody.querySelectorAll(".ghd-wrap-toggle"), function (ghd) {
				ghd.remove();
			});

			Array.prototype.forEach.call(commentBody.querySelectorAll("pre code"), function (pre) {
				pre.innerHTML = pre.innerHTML.replace(/\n$/g, '');
			});

			commentText = turndownService.turndown(commentBody.innerHTML);
		}

		return commentText;
	}

    function addReplyButtons() {
		Array.prototype.forEach.call(document.querySelectorAll(".comment, .review-comment"), function (comment) {
			var oldReply = comment.querySelector(".GithubReplyComments, .GithubCommentEnhancerReply");
			if (oldReply) {
				oldReply.parentNode.removeChild(oldReply);
			}

			var header = comment.querySelector(":scope > :not(.minimized-comment) .timeline-comment-header"),
				actions = comment.querySelector(":scope > :not(.minimized-comment) .timeline-comment-actions");

			if (!header) {
				header = actions;
			}

			if (!actions) {
				if (!header) {
					return;
				}
				actions = document.createElement("div");
				actions.classList.add("timeline-comment-actions");
				header.insertBefore(actions, header.firstElementChild);
			}

			var reply = document.createElement("button");
			reply.setAttribute("type", "button");
			reply.setAttribute("title", "Responder Comentário");
			reply.setAttribute("aria-label", "Responder Comentário");
			reply.classList.add("GithubReplyComments", "btn-link", "timeline-comment-action", "tooltipped", "tooltipped-ne");
			reply.addEventListener("click", function (e) {
				e.preventDefault();

				var timestamp = comment.querySelector(".js-timestamp, .timestamp");

				var commentText = getCommentMarkdown(comment);
				commentText = commentText.trim().split("\n").map(function (line) {
					return "> " + line;
				}).join("\n");

				var newComment = getCommentTextarea(this);

				var author = comment.querySelector(".author");
				var authorLink = location.origin + (author.getAttribute("href") || "/" + author.textContent);

				var text = newComment.value.length > 0 ? "\n" : "";
				text += String.format('[**@{0}**]({1}) comentado em [{2}]({3} "{4}"):\n{5}\n\n',
					author.textContent,
					authorLink,
					timestamp.firstElementChild.getAttribute("title"),
					timestamp.href,
					timestamp.firstElementChild.getAttribute("datetime"),
					commentText);

				newComment.value += text;
				newComment.setSelectionRange(newComment.value.length, newComment.value.length);

				newComment.focus();

				newComment.dispatchEvent(new CustomEvent('change', {
					bubbles: true,
					cancelable: false
				}));

				// https://github.com/ckeditor/github-writer
				// https://github.com/ckeditor/github-writer/blob/8dbc12cb01b7903d0d6c90202078214a8637de6d/src/app/plugins/quoteselection.js#L116-L127
				const githubWriter = newComment.closest([
					'form.js-new-comment-form[data-github-writer-id]',
					'form.js-inline-comment-form[data-github-writer-id]'
				].join());
				if (githubWriter) {
					window.postMessage({
						type: 'GitHub-Writer-Quote-Selection',
						id: Number(githubWriter.getAttribute('data-github-writer-id')),
						text: text
					}, '*');
				}
			});

			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.classList.add("octicon", "octicon-mail-reply");
			svg.setAttribute("height", "16");
			svg.setAttribute("width", "16");
			reply.appendChild(svg);
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", "M6 2.5l-6 4.5 6 4.5v-3c1.73 0 5.14 0.95 6 4.38 0-4.55-3.06-7.05-6-7.38v-3z");
			svg.appendChild(path);

			actions.appendChild(reply);
		});
	}

    // init
    addReplyButtons();

    // pjax
    document.addEventListener('pjax:end', addReplyButtons); 
})();
