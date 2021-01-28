# Go Language Definition for Nova

A quick &amp; dirty Go language definition for the (upcoming) [Panic Nova](https://panic.com/nova) editor.

**Note:** This is still a preliminary alpha version with somewhat working syntax highlighting.

# Installation

If you got it from inside Nova, there is nothing else to do!

If not, you can simply clone it with `git clone https://github.com/GwynethLlewelyn/Go.novaextension`, and, with luck, macOS will magically turn that folder into a cute icon for Nova extensions, and by clicking on it, you should be able to install it. At least, that's the theory!

In either case, additional Go specific features are available by installing the [Go Language Server](https://github.com/golang/tools/blob/master/gopls/README.md), `gopls`, as described [here](https://github.com/golang/tools/blob/master/gopls/doc/user.md#installation). Then tick the *Enable Language Server* checkbox in the Preferences for this extension. If `gopls` is installed in your search `PATH`, the extension should find it. If it is elsewhere, set that where in the Preferences for this extension as well. Note that Nova's language server support and `gopls` are both new and evolving. Many things don't work quite right yet.

# Disclaimers

I'm a bit clueless about how the syntax highlighting engine/parser actually parses the language files. There is next-to-zero 'official' documentation; however, on the site for an editor made by a competitor, it looks like they have used something very similar, and — allegedly! — based on the original Coda syntax (not Coda 2!). Apparently, Nova uses a variant of the same parser 'family'.

This version includes a `Go.xml` Syntax template which was cobbled together out of a _lot_ of sources, namely, the Coda 2 Go language definition files; the Nova (included) language files for PHP, TypeScript (because Go is also strongly typed), JavaScript; and the extraordinary (but sadly incomplete) work made by **@ambelovsky** on GitHub, when adapting the old Coda syntax for the editor from the competition. Several of his comments have been copied and incorporated. His work was sadly not complete, still had a lot of errors (basically he used the template for JavaScript), and, at the date of writing, was abandoned eight years ago. It still had lots of very interesting structures to parse the Go language (while leaving several others unimplemented). While strongly _inspired_ by his work, this is not merely a copy & paste — many adaptations were required to get at least some of the functionality to actually work. Most doesn't (it gets silently ignored) and I still haven't figured out how to deal with them...

Additionally, I've included a Syntax template for Go Templates. It's almost exactly the same as the syntax for Smarty templates (which I have been using) with some tiny changes, which I hope to have correctly implemented.

Although the current version includes a Completions file, I don't see any kind of completion happening (except for closing braces). I've tried to figure out how the syntax of the Completions file works, but it's even more obscure (to me) than the actual Syntax file. The two are also possibly related — through common identifiers — but I fail to understand exactly how the two 'play' together.

Also, Nova — unlike Coda — allegedly allows extensions to use the [Language Server Protocol](https://langserver.org/) (like their closest competitors do), which enables a 'write once, reuse often' philosophy for writers of syntax checkers. In other words, the hard work is put into creating a _functioning_ LSP 'server' (basically an application that reads a file in a specific language, or parts of a file, and figures out if it has any syntax errors) by the community of syntax checkers. _Then_ editor plugins (of all kinds, not only desktop apps) can interface with such a server in order to get syntax checking. In theory, it's a very easy way to quickly expand the ability for a code editor to accept gazillions of languages without requiring the developers to spend days and nights coding as many syntax checkers as possible. With new languages coming up all the time, many becoming fashionable for a few years and disappearing shortly afterwards, this method ensures that editor developers are not wasting their precious time. It also means that updating syntax checkers for upcoming new versions of a specific language will not require any coding — just upgrade the LSP server. And, finally, it also means that _all_ code editors will check syntax in the _same, predictable_ way (and also that _all_ will get upgraded to the latest version of the syntax almost immediately), which means that, if you switch editors, the 'new' editor will _already_ support the latest version of your favourite programming language _and_ syntax checking will work in pretty much the same way...

Therefore, this extension _tries_ to use the official (Google-supported) [Go Language Server](https://github.com/golang/tools/blob/master/gopls/README.md) if you install it as described in the Installation section above.

Is it worth it? Again, I can't reply to that. Maybe, at some point in time, there will be an 'universal', online LSP, hosted by a benevolent corporation (LSP was sort of 'invented' by Microsoft), and _all_ editors might tap into it; or maybe operating system developers will ship LSPs for most languages and run these as services, so that _all_ syntax checking tools on your laptop (or mobile device) will automagically use the available LSP for each programming language you use, and keep those updated using package managers. I don't know. This might be what everybody does in 2025.

Until then, you're stuck with downloading 23 MBytes just to get some _additional_ Go language syntax checking, which sadly does not even seem to work all the time. Sorry about that! Nova logs some laguage server interaction in the Extension Console, and if you run the extension in "developer mode" (see the *Extension Development* item in Nova's *General* preferences) `gopls` will write logs to `/tmp/gopls.log` but these can be a bit cryptic.

In conclusion: all of the above is really a _work in progress_ — or rather, a _lot_ of work in progress. There is far less functionality which actually does anything than lots of files with rules that are _supposed_ to do _something_ but... don't. Therefore, _caveat utilitor_.

Suggestions and bug reports are more than welcome, but please take into account that I'm new to all of this, and might not be able to even _understand_ most of your issues, much less _fix_ them! But I'm learning...

## My GPG Fingerprint

In case you need it to send me encrypted emails:

> CE8A 6006 B611 850F 1275 72BA D93E AA3D C4B3 E1CB
