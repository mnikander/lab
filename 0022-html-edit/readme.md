# Question
<!-- What am I figuring out? -->

How can the content and structure of an HTML page be edited in place?

Date:   2026-05-14
Status: Done

## Resources
<!-- Where can I find relevant information? -->

- [MDN: HTML - Creating the Content](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content)
- [MDN: HTML cheatsheet](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Cheatsheet)
- [MDN: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- create a simple index.html
- create an editable element
- put try to highlight a set of keywords
- write javascript which updates the HTML structure on a keypress
- put keywords into their own elements with the keyword class
- define CSS to mark keyword elements in blue

## Running the Code
<!-- What steps are required to run the code? -->

- open index.html in the browser

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- created simple index.html
- experimented with several different tags such as div, span, paragraph
- experimented with the `contenteditable` property
- created a class to format keywords in their own color
- created a `textarea` for input and changed it's padding and color so it looks like the rest of the page
- created a separate editor and viewer area
- AI-generated javascript code which converts the text from the input area into structured HTML with 'span' around keywords in the viewer
- AI-generated the CSS to make the textarea (i.e. editor) invisible and place it exactly underneath the the viewer

## Findings
<!-- What did I learn? -->

- learned some of the basics of HTML
- the MDN pages are _really_ good, they are an excellent resource for the future
- learned that `<div></div>` and `<span></span>` tags can be useful to format things because they don't don't impact formatting on their own
- working with HTML by hand is actually pretty simple, more complicated that markdown, but not that much more complicated
- HTML feels just like a nested algebraic datatype (ADT)
- working with HTML via javascript feels kind of opaque, because a tremendous amount of stuff is built-into the ecosystem including the syntax and semantics for events and it's not immediately obvious that it's just manipulation of an ADT and event programming

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- understand _what_ the generated JavaScript code does and _why_ it works
- go through the MDN tutorial on JavaScript inside HTML for [adding interactivity](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity)
- try to identify if/what parallels there are between working with HTML and working with an ADT -- can you pattern-match to work your way through the DOM?
- does the Elm language or the React Framework make that algebraic nature of HTML more direct?

---
**Copyright (c) 2026 Marco Nikander**

