var mercury = require("../../index.js")
var h = require("../../index.js").h

var Update = require("./update.js")

module.exports = Render

function Render(state) {
    return h(".issue-viewer-wrap", {
        "style": { "visibility": "hidden" }
    }, [
        h("link", {
            rel: "stylesheet",
            href: "/mercury/examples/github-issues-viewer/style.css"
        }),
        h(".issue-viewer", [
            repoInput(state),
            state.errorMessage ?
                h("h3", "Error loading repo: " + state.errorMessage) :
                null,
            mainContent(state)
        ])
    ])
}


function repoInput(state) {
    var disabled = !Update.validRepo(state.repo.value, state.repoText)

    return h(".repo-input", {
        "data-event": [
            mercury.changeEvent(state.events.setRepo),
            mercury.submitEvent(state.events.submitRepo)
        ]
    }, [
        h("span.repo-input__title", "View Issues From"),
        h("input", {
            placeholder: "owner/repo",
            value: state.repoText,
            name: "repo"
        }),
        h("button", {
            disabled: disabled
        }, "load")
    ])
}

function mainContent(state) {
    return h(".main-view", [
        h(".page .all-issues-page", [
            h(".mypager", "Some pager"),
            h("ul.issue-list",
                state.issues.map(showIssue.bind(null, state))),
            h(".mypager", "Some pager")
        ])
    ])
}

function showIssue(state, issue) {
    var href = state.repo.value + "/issue/" + issue.id

    return h("li.issue-list__item", [
        h(".issue", [
            h(".issue__left", [
                h("a.issue__header", {
                    href: href
                }, [
                    h("span.issue__id", String(issue.number)),
                    h("span.issue__title", issue.title)
                ]),
                h(".issue__body", Update.teaser(issue.body))
            ]),
            h(".issue__right", [
                h("a.issue__user", {
                    href: issue.user.html_url
                }, [
                    h("img.user__avatar", {
                        src: issue.user.avatar_url
                    }),
                    h("span.user__login", issue.user.login),
                    showLabels(
                        issue.labels,
                        ".issue__labels.labels--vertical"
                    )
                ])
            ])
        ])
    ])
}

function showLabels(labels, className) {
    return h("ul.labels" + className, labels.map(showLabel))

    function showLabel(label) {
        return h("li.labels__label", [
            h("a.label", {
                href: label.url,
                style: {
                    backgroundColor: "#" + label.color
                }
            }, label.name)
        ])
    }
}