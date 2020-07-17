# Go Language Definition for Nova

A quick &amp; dirty Go language definition for the (upcoming) [Panic Nova](https://panic.com/nova) editor.

**Note:** This is still a very preliminary alpha version, syntax highlighting sort of works, but the main reason for this particular version is just to check if I can get it to be uploaded to the Extension Library; sometimes the upload succeeds, sometimes it doesn't.

# Installation

If you got it from inside Nova, there is nothing else to do!

If not, you can simply clone it with `git clone https://github.com/GwynethLlewelyn/Go.novaextension`, and, with luck, macOS will magically turn that folder into a cute icon for Nova extensions, and by clicking on it, you should be able to install it. At least, that's the theory!

# Disclaimers

I'm really _quite_ clueless about what I'm doing, and sort of navigating blindly through the documentation and a few scattered examples here and there, which are _very_ minimalistic.

So, this extension includes a `Syntaxes/Go.xml` syntax file, cooked out of the JavaScript syntax file and the Coda 2 syntax file for Go. The syntax files for Coda 2 and Nova are _quite_ different, so I have no idea how well this will work on all possible Nova installs. You might get errors, or not have it work at all. As always, _caveat utilitor_.

Nova — unlike Coda — allegedly allows extensions to use the [Language Server Protocol](https://langserver.org/) (like their closest competitors do), which enables a 'write once, reuse often' philosophy for writers of syntax checkers. In other words, the hard work is put into creating a _functioning_ LSP 'server' (basically an application that reads a file in a specific language, or parts of a file, and figures out if it has any syntax errors) by the community of syntax checkers. _Then_ editor plugins (of all kinds, not only desktop apps) can interface with such a server in order to get syntax checking. In theory, it's a very easy way to quickly expand the ability for a code editor to accept gazillions of languages without requiring the developers to spend days and nights coding as many syntax checkers as possible. With new languages coming up all the time, many becoming fashionable for a few years and disappearing shortly afterwards, this method ensures that editor developers are not wasting their precious time. It also means that updating syntax checkers for upcoming new versions of a specific language will not require any coding — just upgrade the LSP server. And, finally, it also means that _all_ code editors will check syntax in the _same, predictable_ way (and also that _all_ will get upgraded to the latest version of the syntax almost immediately), which means that, if you switch editors, the 'new' editor will _already_ support the latest version of your favourite programming language _and_ syntax checking will work in pretty much the same way...

Therefore, this extension _tries_ to use the official (Google-supported) [Go Language Server](https://github.com/golang/tools/blob/master/gopls/README.md). It's still in Beta, but, these days, what isn't?

I've just provided the bare minimum to encapsulate the Go LSP app (`gopls`, pronounced 'go please') inside a Nova extension. I have no idea if it works. The app itself is, obviously, written in Go, and uses almost 23 MBytes on disk. Is it worth it? Again, I can't reply to that. Maybe, at some point in time, there will be an 'universal', online LSP, hosted by a benevolent corporation (LSP was sort of 'invented' by Microsoft), and _all_ editors might tap into it; or maybe operating system developers will ship LSPs for most languages and run these as services, so that _all_ syntax checking tools on your laptop (or mobile device) will automagically use the available LSP for each programming language you use, and keep those updated using package managers. I don't know. This might be what everybody does in 2025.

Until then, you're stuck with downloading 23 MBytes just to get some Go language syntax checking. Sorry about that!

Oh, and it clearly is not working yet. If you open the Extension Console, you'll see some debugging going on; the calls to the Go LSP seem to fail with some kind of error that I cannot catch. You can see some logs being written on `/tmp/gopls.log` but these are hardly helpful at this point.

Suggestions and bug reports are more than welcome, but please take into account that I'm new to all of this, and might not be able to even _understand_ most of your issues, much less _fix_ them! But I'm learning...

## My GPG Fingerprint

In case you need it to send me encrypted emails:

> CE8A 6006 B611 850F 1275 72BA D93E AA3D C4B3 E1CB
