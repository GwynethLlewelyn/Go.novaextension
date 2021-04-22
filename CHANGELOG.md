## Version 0.4.2

- Thanks to @logan's changes on correctly implementing Markdown hover tags!

## Version 0.4.1

- Added checkbox on preferences to use https://staticcheck.io/ to do additional code analysis.

## Version 0.4.0

- Nova 5.1 is out and it supports Language Servers much better! Enjoy the quasi-IDE environment!
- Added support for editing `go.mod` files. Note: If you've installed [VLC](https://www.videolan.org/vlc/), `.mod` files are thought to be audio files, thus they're not easily opened with Nova (added `Tests/go.mod.sample` to test it out).
- *Big* cleaning up of the syntax definition file; all regular expressions have been tested, one by one, and fixed in uncountable cases. Even capturing complex numbers works! Much better syntax highlighting. Incidentally, issue [_#1_](https://github.com/GwynethLlewelyn/Go.novaextension/issues/1) got fixed, after 7 months...
- The **Editor > Go** menu options for text formatting and reorganising imports work about 80% of the cases. They are now interfacing correctly with `gopls` and retrieving proper replacement information (who'd think that Google would send all updates _in reverse order_?!). So, no need to run any additional external commands for those operations; `gopls` is _supposed_ to do all the work from now on.
- Sadly, the option to format/optimise imports on _saving_ is **not** functional. There is an **experimental** checkbox for it on the preferences, but **DO. NOT. CHECK. IT.**. It will _literally_ destroy your files when saving them. Basically, it runs the formatter twice, for some unfathomable reason, and I couldn't find a way to prevent that.

### To-do:
- Add a checkbox to get your code additionally validated by https://staticcheck.io/. It's easy enough to set up — it's fully integrated by Google in `gopls` itself!
- Make the _new_ code to convert from Nova ranges into LSP ranges a bit more efficient; or pester Panic to do that conversion available via the JS API (after all, they use it internally!). Note that this is mostly a proof-of-concept version (it's still alpha code, remember? 😉) just to fix an annoying bug that comes from wrong assumptions about `gopls` (other Language Servers seem to work... all have their own quirks).
- Figure out _why_ `gopls` is running *twice* when saving (thus thrashing everything), although just once when called from the menu options. I've clearly hit a personal limit; this is beyond my ability and knowledge to understand at the moment.
- Figure out how to install VLC and still have Nova opening `go.mod` files without thinking they're video files!

## Version 0.3.5

- Basically just bumping the version to remove the warning about not being possible to update this extension via the Nova Extension Library. Panic fixed everything!
- Amazingly, the reorganisation of import files, via `gopls`, seems to work! 😲 Try to mouse-select your imports and click on **Editor > Go > Organize Imports** — this should do *something*
- The extension still crashes if it is deactivated/reactivated; also, it now might get a bit confused when figuring out if the `gopls` server is running or not. Sometimes it requires a reset (via the check box on Preferences).

## Version 0.3.4

- Many of the crashes are related to objects which haven't been correctly initialised, or, worse, released (google for `KVO_IS_RETAINING_ALL_OBSERVERS_OF_THIS_OBJECT_IF_IT_CRASHES_AN_OBSERVER_WAS_OVERRELEASED_OR_SMASHED`); this release attempts to fix some of those errors
- Added more `try{...}catch` constructs in order to see some (possibly hidden) errors _before_ Nova crashes
- Slightly changed a few functions to better deal with the differences in handling extensions with a Language Server, compared to earlier Nova versions

## Version 0.3.3

- Finally figured out how to turn hover Markdown off! Next step: figuring out how to _fix_ it...
- Banner logo is back, I thought it made a difference when downloading the extension, but no: the problem lies elsewhere on Nova's servers (as of writing, they're on it and trying to fix things)
- Fixed a few extra things, again, to comply with the extension template
- Tried to incorporate @jfieber's changes (a few options now appear on the Editor menu, but they don't do much; I know that they're _working_, since they _do_ get `gopls` to write things on the log)
- Updated license to display contributors (Nova won't show it, though)
- Updated README with some extra thanks and a warning that downloading this extension/updating it may fail due to some as-yet-unsolved issues with Panic's Nova Extension Library server (this plugin is not the only one being affected)

## Version 0.3.2

- Changed some of the code to comply better with the latest extension template included with Nova 4.3 — this may, or may not, fix some crashing issues (because things were called differently before)
- Force `gopls` to use plain text instead of Markdown, on a single line; it's not as nice, but at least it works
- Apparently there was some issue with Nova's library extension server earlier on, and that's why the earlier version failed, it should get fixed sooner or later

## Version 0.3.1

- Bumping the version because something went wrong with the upload

## Version 0.3.0

- Major rewriting of the code base, mostly thanks to the generous work provided by @jfieber and @seripap. Thanks guys!
- LSP interfacing with `gopls` now works! But don't expect miracles, we haven't still figured out all of it. Use `brew install gopls`.
- A few extension preferences were added by @jfieber (namely, turning LSP on and off, etc.); also, for development purposes, `gopls` will write some (cryptic) logs under `/tmp/gopls.log`
- Added more references to licenses; we are now including open-source code from Microsoft (I never though I'd ever write this in my lifetime! 😳🤓)
- Added more blahblahblah to the [README.md](README.md) (and a few markdown tricks!)
- New logo (ok, this is trivial, but I'm trying to keep up with Panic's re-styling! 😅)
- To-do: figure out why `gopls` sends raw Markdown that Nova doesn't seem to understand
- To-do: understand why the extension crashes so often (at least in dev mode); it's possible that some cleanup code is missing and/or broken
- Tested under Nova 4.3

## Version 0.2.1

- Small JSON change from 'vendor' to 'organization' according to the new specs for the Nova Beta 1.0b18 (195066)
- Tried to add `gopls` again, but couldn't

## Version 0.2.0

- Added gazillions of changes, based on several different templates and the manuals of a competitor editor which uses similar syntax (which was originally based on the templates for Coda!)
- While this produces slightly better matching, there are tons of rules that never get activated but I don't know why
- Added a Smarty-like parser for Go Templates (it's basically the same concept with some tiny, Go-specific changes)
- Added some test files, please ignore them, they're not meant to be 'working code' (nor even valid one)
- Had to remove `gopls` because it's too big! You can download it from https://github.com/golang/tools/tree/master/gopls

## Version 0.1.6 (never released)

- With the new Nova Beta update to 1.0b17 (Build 190148) it looks like the executable for `gopls` lost its executable flag; if that did make a difference or not is beyond me, but I recompiled `gopls` again, with newer libraries.
- When clicking on the syntax inspector button (at the bottom of each pane, the tiny 'target' icon which is to the left of the 'current symbol'), now 'something' happens when randomly clicking on Go code (i.e. there is a modal popup box that shows some information). If that's the desired behaviour or not... I have no idea.

## Version 0.1.5

- Make `.mod` files (e.g. `go.mod`) be part of the extensions, or else they will be seen as music files

## Version 0.1.4

Cleaning up the logs when instance is deactivated.

## Version 0.1.3

- Bumped version again
- Some more experiments on the test file `basictest.go`

## Version 0.1.2

- Slight bug on `main.js` (missing bracket)

## Version 0.1.1

- Version 0.1.0 was successfully uploaded to the Extensions Library!!
- Go LSP seems not to be working at all
- Lots of errors in syntax highlighting (e.g. variable declaration)

## Version 0.1.0

- After checking the many XML files, I found three minor bugs, and now the syntax highlighting not only works, but it shows up as a 'valid' language on all the places that it ought to show up!
- Apparently, you cannot have any images under the `Images/` folder, or uploading to the Extension Library does _not_ work
- Still working to fix the connection to the Go LPS (it's not being launched right now, but I have some ideas to fix it...)

## Version 0.0.2

- Syntax definition XML based on Nova JavaScript, using definitions from the old Coda 2 Go mode
- Tried to add Go LPS support
- Added the logo and a few things

## Version 0.0.1

Initial release — based on the original Coda 2 Go mode
