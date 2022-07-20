/* jshint -W097 */

'use strict';

var requiredApprovals = 1;
var approvalString = '=Aprovado=';

/* não editar as linhas abaixo */

var css = '<style>z {} svg.octicon { pointer-events: none; }';
var style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode(css));

document.getElementsByTagName('head')[0].appendChild(style);

function disableButton() {
    var button = document.querySelector('.js-merge-branch-action');

    if (button) {
        button.disabled = true;
    }
}

function enableButton() {
    var button = document.querySelector('.js-merge-branch-action');

    if (button) {
        button.disabled = false;
    }
}

function findCommentWrapper(el) {
    while (el.parentNode) {
        el = el.parentNode;

        if (el.classList.contains('timeline-comment-wrapper')) {
            return el;
        }
    }

    return null;
}

function findCommitSiblings(el) {
    while (el.nextElementSibling) {
        el = el.nextElementSibling;

        if (el.classList.contains('discussion-commits')) {
            return el;
        }
    }

    return null;
}

function lookForApproval(d) {
    var delay = d || 1000;

    setTimeout(function () {
        var comments = document.querySelectorAll('.comment-body p');
        var foundApprovals = 0;

        for (var i = comments.length - 1; i >= 0; i--) {
            if (comments[i].textContent === approvalString) {
                var parent = findCommentWrapper(comments[i]);

                if (parent) {
                    if (!findCommitSiblings(parent)) {
                        foundApprovals++;

                        if (foundApprovals === requiredApprovals) {
                            enableButton();

                            break;
                        }
                    }
                }
            }
        }

        if (foundApprovals < requiredApprovals) {
            disableButton();
        }
    }, delay);
}

function checkListener(e) {
    if (
        (e.type === 'click' && (e.target.classList.contains('btn-primary') || e.target.classList.contains('delete-button'))) ||
        (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && e.target.classList.contains('js-comment-field'))
    ) {
        lookForApproval();
    }
}

waitForKeyElements('.js-merge-branch-action', function () {
    document.addEventListener('click', checkListener, false);
    document.addEventListener('keydown', checkListener, false);
    lookForApproval();
});
