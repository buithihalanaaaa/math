# Math Expression Search

This repository contains experimental scripts for searching and manipulating MathML expressions. Some of the JavaScript files expect a sample XHTML document named `test.xhtml` to load and process MathML.

## `test.xhtml`

`queryProcessing.js` and `mregui.js` load `test.xhtml` to obtain the collection of MathML formulas that are searched or highlighted. A minimal example file is included at the repository root with two MathML expressions. You can replace this file with any valid MathML content or extend it with additional formulas.

If you want to generate the file dynamically from your own MathML sources, place the resulting XHTML document at the project root as `test.xhtml` so that the scripts can access it via `loadXMLDoc()`.

