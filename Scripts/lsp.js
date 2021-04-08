// Turn a Nova start-end range to an LSP row-column range.
// From https://github.com/apexskier/nova-typescript
//
// Adding the original license terms from Microsoft, as shown on @apexskier's
//  own files (gwyneth 20200130)
// Probably this is the [Microsoft Public License (MS-PL)](https://opensource.org/licenses/MS-PL)
//
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//
exports.RangeToLspRange = function (document, range) {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let chars = 0;
  let startLspRange;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (!startLspRange && chars + lineLength >= range.start) {
      const character = range.start - chars;
      startLspRange = { line: lineIndex, character };
    }
    if (startLspRange && chars + lineLength >= range.end) {
      const character = range.end - chars;
      return {
        start: startLspRange,
        end: { line: lineIndex, character },
      };
    }
    chars += lineLength;
  }
  return null;
};

// Turn an LSP row-column range to a Nova start-end range.
// From https://github.com/apexskier/nova-typescript
exports.LspRangeToRange = function (document, range) {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let rangeStart = 0;
  let rangeEnd = 0;
  let chars = 0;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (range.start.line === lineIndex) {
      rangeStart = chars + range.start.character;
    }
    if (range.end.line === lineIndex) {
      rangeEnd = chars + range.end.character;
      break;
    }
    chars += lineLength;
  }
  if (nova.inDevMode()) {
    console.info(`LspRangeToRange() — Range Start: ${rangeStart}; Range End: ${rangeEnd}; Start > End? ${rangeStart > rangeEnd}`);
  }
  if (rangeStart < rangeEnd) {
    return new Range(rangeStart, rangeEnd);
  } else {
    return undefined;
  }
  // } else if (rangeStart > rangeEnd) {
  //   return new Range(rangeEnd, rangeStart);
  // } else {
  //   // if they're equal, we'll probably want to change this line only...
  //   return new Range(rangeStart, rangeEnd + 1)
  // }
};

// Apply a TextDocumentEdit
// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentEdit
exports.ApplyTextDocumentEdit = (tde) => {
  if (tde && tde.textDocument && tde.edits) {
    // Obtain a Nova TextEditor for the document
    return nova.workspace
      .openFile(tde.textDocument.uri)
      .then((editor) => {
//        exports.ApplyTextEdits(editor, tde.edits);
        return exports.ApplyTextEditsRevamped(editor, tde.edits);  // making an experiment
      })
      .catch((err) => {
        console.error('error opening file', err);
      });
  } else {
    console.info('no edits to apply, it seems');
  }
};

// Apply a TextEdit[]
// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textEdit
exports.ApplyTextEdits = (editor, edits) => {
  return editor
  .edit((tee) => {
    edits.reverse().forEach((e) => {
      var r0 = exports.LspRangeToRange(editor.document, e.range);
      var r1 = new Range(r0.start, r0.end);
      tee.replace(r1, e.newText);
    });
  })
  .then(() => {
    console.info(`${edits.length} changes applied to ${editor.document.path}`);
  });
}

// NovaPositionFromLSPRange calculates the position relative to LSP (line; character).
// Conceptually similar to LspRangeToRange, but with a different purpose (see ApplyTextEditsRevamped).
// Note: this will very likely blow up since calculations assume UTF-16 (don't you hate Microsoft?)
// (gwyneth 20210406)
exports.NovaPositionsFromLSPRangeElement = function(document, lspLine, lspCharacter) {
  const fullContents = document.getTextInRange(new Range(0, document.length));
  let position = 0;
  let chars = 0;
  const lines = fullContents.split(document.eol);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + document.eol.length;
    if (lspLine === lineIndex) {
      position = chars + lspCharacter;
      // break; // we can save a few cycles
      return position; // get out of the loop as early as possible
    }
    chars += lineLength;
  }
/*  if (nova.inDevMode()) {
    console.info(`NovaPositionsFromLSPRangeElement() — LSP Line: ${lspLine}; LSP Column: ${lspCharacter}; Nova Position: ${position}`);
  }*/
  return position;
}

// ApplyTextEditsRevamped calculates if a bit of formatted has to be inserted, replaced, or removed.
// Using ApplyTextEdits will just work for inserting formatted text; but we need a bit more logic in our case
// See also https://github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/specification-3-17.md#textEdit to understand how insert/replace/remove is signalled by the LSP (gwyneth 20210406)
exports.ApplyTextEditsRevamped = (editor, edits) => {
  return editor.edit((tee) => { // tee - text editor edit (that's how Panic calls it!)
    edits.slice().reverse().forEach((e) => {  // stupid, but gopls sends these in *reverse* order!! (gwyneth 20210407)
      // very, very inefficient for now, but we will improve later using just one loop (gwyneth 20210406)
      var startPosition = exports.NovaPositionsFromLSPRangeElement(editor.document, e.range.start.line, e.range.start.character);
      var endPosition = exports.NovaPositionsFromLSPRangeElement(editor.document, e.range.end.line, e.range.end.character);

      if (e.newText == null || e.newText == undefined || e.newText == "") {  // this means we're going to _delete_ the characters in the range, and that the range must be valid
        var deletedRange = new Range(startPosition, endPosition -1);
        tee.delete(deletedRange);
        console.info(`Deleting text from (${e.range.start.line},${e.range.start.character}) to (${e.range.end.line},${e.range.end.character}) [${startPosition}-${endPosition}]`);
      } else if (startPosition == endPosition) { // this means insert a new range
        tee.insert(startPosition, e.newText);
        console.info(`Inserting «${e.newText}» at (${e.range.start.line},${e.range.start.character}) [${startPosition}]`);
      } else if (startPosition < endPosiiton) {
          var replacedRange = new Range(startPosition, endPosition -1);
          tee.replace(replacedRange, e.newText);
          console.info(`Replacing from (${e.range.start.line},${e.range.start.character}) to (${e.range.end.line},${e.range.end.character}) [${startPosition}-${endPosition}] with «${e.newText}»`);
      } else {
          console.error(`Something bad happened, we should have never reached this spot! We got LSP range: (${e.range.start.line},${e.range.start.character}) to (${e.range.end.line},${e.range.end.character}), Nova Range: [${startPosition}-${endPosition}], text: «${e.newText}»`);
      }
    });
  })
  .then(() => {
    console.info(`${edits.length} changes applied to ${editor.document.path}`);
  });

}
