// Turn a Nova start-end range to an LSP row-column range.
// From https://github.com/apexskier/nova-typescript
//
// Adding the original license terms from Microsoft, as shown on @apexskier's
//  own files (gwyneth 20200130)
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
  return new Range(rangeStart, rangeEnd);
};

// Apply a TextDocumentEdit
// https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentEdit
exports.ApplyTextDocumentEdit = function (tde) {
  if (tde && tde.textDocument && tde.edits) {
    // Obtain a Nova TextEditor for the document
    nova.workspace
      .openFile(tde.textDocument.uri)
      .then((editor) => {
        exports.ApplyTextEdits(editor, tde.edits);
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
exports.ApplyTextEdits = function(editor, edits) {
  editor.edit((tee) => {
    var shift = 0;
    edits.forEach((e) => {
      var r0 = exports.LspRangeToRange(editor.document, e.range);
      var r1 = new Range(r0.start + shift, r0.end + shift);
      tee.replace(r1, e.newText);
      shift = shift + (e.newText.length - r1.length);
    });
  })
  .then(() => {
    console.info(`${edits.length} changes applied to ${editor.document.path}`);
  });
}
