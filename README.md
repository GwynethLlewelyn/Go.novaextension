![Go Nova Extension Logo](https://github.com/GwynethLlewelyn/Go.novaextension/blob/master/Images/extension/Go-Nova-Banner.png?raw=true)

# Go Language Definition for Nova

An attempt to build a Go language definition for the [Panic Nova](https://panic.com/nova) editor.

## ☠️☢️⚠️ Warning! ⚠️☢️☠️

It seems that some plugins are having some difficulty being downloaded from Nova's official Extension Library. Panic is actively working on it, but if you cannot apply this update automatically, you'll have to do it manually, cloning from <https://github.com/GwynethLlewelyn/Go.novaextension/> and manually installing the extension.

Hopefully this gets fixed soon! 🤞

## 🙏 Thanks 🙏

My personal thanks to the major contributors of this project, without whom this extension would never been working:

- [@jfieber](https://github.com/jfieber) (John Fieber)
- [@seripap](https://github.com/seripap) (Daniel Seripap)

Additionally, much of the more intricate and obscure issues have been solved by shamelessly copying code from:

- [@apexskier](https://github.com/apexskier) (Cameron Little)

**Note:** This is still an **alpha** version with reasonably working syntax highlighting and some extra goodies from using the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), but it is plagued by unstability issues and frequent crashing. See below for some guidelines.

If nothing here works for you, you might try to use Spicer Matthews' own [GoTools](nova://extension?id=cloudmanic.GoTools "This link will open only in Nova") extension. The syntax highlighting should be about the same.

# Installation

Once activated, files ending in `*.go` should automatically be recognised (and formatted) as Go language files. Similarly, `*.tmpl` [Go template files](https://golang.google.cn/pkg/html/template/) will also be recognised<sup id="a1">[1](#f1)</sup>.

In either case, additional Go specific features are available by installing the [Go Language Server](https://github.com/golang/tools/blob/master/gopls/README.md), `gopls`.

If you use [Homebrew](https://brew.sh/) to install your packages, all you need is to type:

`brew install gopls`

If not, you can install it as described [here](https://github.com/golang/tools/blob/master/gopls/doc/user.md#installation).

Then tick the *Enable Language Server* checkbox in the Preferences for this extension. If `gopls` is (correctly) installed in your search `PATH`, the extension should find it. If it is elsewhere, set that where in the Preferences for this extension as well. Note that Nova's language server support and `gopls` are both new and evolving. Many things don't work quite right yet<sup id="a2">[2](#f2)</sup>.

# Disclaimers

I'm a bit clueless about how the syntax highlighting engine/parser actually parses the language files. There is next-to-zero 'official' documentation; however, on the site for an editor made by a competitor, it looks like they have used something very similar, and — allegedly! — based on the original Coda syntax (not Coda 2!). Apparently, Nova uses a variant of the same parser 'family'.

This version includes a `Go.xml` Syntax template which was cobbled together out of a _lot_ of sources, namely, the Coda 2 Go language definition files; the Nova (included) language files for PHP, TypeScript (because Go is also strongly typed), JavaScript; and the extraordinary (but sadly incomplete) work made by [@ambelovsky](https://github.com/ambelovsky/espresso-golang) on GitHub, when adapting the old Coda syntax for the editor from the competition. Several of his comments have been copied and incorporated. His work was sadly not complete, still had a lot of errors (basically he used the template for JavaScript), and, at the date of writing, was abandoned eight years ago. It still had lots of very interesting structures to parse the Go language (while leaving several others unimplemented). While strongly _inspired_ by his work, this is not merely a copy & paste — many adaptations were required to get at least some of the functionality to actually work. Most doesn't (it gets silently ignored) and I still haven't figured out how to deal with them...

Additionally, I've included a Syntax template for Go Templates. It's almost exactly the same as the syntax for Smarty templates (which I have been using) with some tiny changes, which I hope to have correctly implemented.

Although the current version includes a Completions file, I don't see any kind of completion happening (except for closing braces). I've tried to figure out how the syntax of the Completions file works, but it's even more obscure (to me) than the actual Syntax file. The two are also possibly related — through common identifiers — but I fail to understand exactly how the two 'play' together.

Also, Nova — unlike Coda — allows extensions to use the [Language Server Protocol](https://langserver.org/) (like their closest competitors do), a Microsoft-promoted effort enabling a '*write once, reuse often*' philosophy for writers of syntax checkers. In other words, the hard work is put into creating a _functioning_ LSP 'server' (basically an application that reads a file in a specific language, or parts of a file, and figures out if it has any syntax errors) by the community of syntax checkers. _Then_ editor plugins (of all kinds, not only desktop apps) can interface with such a server in order to get syntax checking. In theory, it's a very easy way to quickly expand the ability for a code editor to accept gazillions of languages without requiring the developers to spend days and nights coding as many syntax checkers as possible. With new languages coming up all the time, many becoming fashionable for a few years and disappearing shortly afterwards, this method ensures that editor developers are not wasting their precious time. It also means that updating syntax checkers for upcoming new versions of a specific language will not require any coding — just upgrade the LSP server. And, finally, it also means that _all_ code editors will check syntax in the _same, predictable_ way (and also that _all_ will get upgraded to the latest version of the syntax almost immediately), which means that, if you switch editors, the 'new' editor will _already_ support the latest version of your favourite programming language _and_ syntax checking will work in pretty much the same way...

Therefore, this extension _tries_ to use the official (Google-supported) [Go Language Server](https://github.com/golang/tools/blob/master/gopls/README.md) if you install it as described in the Installation section above.

This is still very quirky. Microsoft developed the LSP specifically for Visual Studio Code, their free, open-source, cross-platform editor, thus allowing non-Microsoft-specific languages to be as easily integrated with their editor. However, the Microsoft specifications are *very* Microsoft-centric, and the Google team behind `gopls` grumbles and complains about several ambiguous descriptions in the protocol, and the choices they've made to implement the (complex) specifications. Sadly, though, those specifications are *very* Google-centric (notice the pattern?) and they don't match easily with the Microsoft ones. And on top of all that, we have to deal with Panic's own implementation of LSP support — which is (at the time of writing!) a bit obscure, a bit opaque, and not exactly super-well-documented (namely, at least for me, it's not obvious what Nova does on its own and what the extension developer has to do). We have to take hints from others who travelled the same road and try to figure out how they've done it.

Note that Nova logs some language server interaction in the Extension Console, and if you run the extension in "developer mode" (see the *Extension Development* item in Nova's *General* preferences) `gopls` will write logs to `/tmp/gopls.log` but these can be a bit cryptic.

In conclusion: all of the above is really a _work in progress_ — or rather, a _lot_ of work in progress. There is far less functionality which actually does anything than lots of files with rules that are _supposed_ to do _something_ but... don't. Therefore, _caveat utilitor_.

Suggestions and bug reports are more than welcome, but please take into account that I'm new to all of this, and might not be able to even _understand_ most of your issues, much less _fix_ them! But I'm learning...

# Well-known bugs

1. Right now, the one that baffles us most is why we *are* getting Markdown from `gopls` but somehow Nova is confused and renders it as plain text (which is... weird). I think I managed to make `gopls` change from Markdown to plain text — so that Nova might at least display a simple one-liner, albeit unformatted.
2. The extension crashes a *lot*, especially when in Development mode. There are no 'obvious' errors showing up on the console or the error logs, so this has been hard to track down (I suspect that there is some cleaning up that is missing). If you're plagued with these constant crashes, just uncheck the *Enable Language Server* checkbox on the Preferences for this extension. You will still get Go syntax highlighting, but the additional goodies provided by LSP will be turned off.
3. There are a few hooks allowing you to *theoretically* run some post-formatting tools to comply with Google's style guidelines for Go, as well as a way to check that all imports are properly referenced, etc. With this version, there is no documentation yet for *how* to activate those extra features, but hopefully this will be addressed in the very near future... fingers crossed!

## My GPG Fingerprint

In case you need it to send me encrypted emails:

> CE8A 6006 B611 850F 1275 72BA D93E AA3D C4B3 E1CB

---

<b id="f1">1</b>&nbsp;I based that parser on the [PHP Smarty templates](https://www.smarty.net/) — Go's syntax is similar.[↩](#a1)

<b id="f2">2</b> A notable example is that for some reason the Markdown emitted by `gopls` is not understood by the Nova editor, which is quite strange, since other LSPs (namely, @apexskier's [TypeScript Extension](https://extensions.panic.com/extensions/apexskier/apexskier.typescript/)) have no such problems.[↩](#a2)