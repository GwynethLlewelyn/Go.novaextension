## Version 0.2.0

- Added gazillions of changes, based on several different templates and the manuals of a competitor editor which uses similar syntax (which was originally based on the templates for Nova!)
- While this produces slightly better matching, there are tons of rules that never get activated but I don't know why
- Added a Smarty-like parser for Go Templates (it's basically the same concept with some tiny, Go-specific changes)
- Added some test files, please ignore them, they're not meant to be 'working code' (nor even valid one)

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
