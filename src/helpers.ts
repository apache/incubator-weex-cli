
//--- begin part copied from AngularJS

//The MIT License
//
//Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

const CLASS_NAME = /class\s+([A-Z].+?)(?:\s+.*?)?\{/;
const CONSTRUCTOR_ARGS = /constructor\s*([^\(]*)\(\s*([^\)]*)\)/m;
const FN_NAME_AND_ARGS = /^(?:function)?\s*([^\(]*)\(\s*([^\)]*)\)\s*(=>)?\s*[{_]/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export function annotate(fn: any) {
  let $inject: any,
    fnText: string,
    argDecl: string[] | null;

  if (typeof fn === "function") {
    if (!($inject = fn.$inject) || $inject.name !== fn.name) {
      $inject = { args: [], name: "" };
      fnText = fn.toString().replace(STRIP_COMMENTS, '');

      let nameMatch = fnText.match(CLASS_NAME);

      if (nameMatch) {
        argDecl = fnText.match(CONSTRUCTOR_ARGS);
      } else {
        nameMatch = argDecl = fnText.match(FN_NAME_AND_ARGS);
      }

      $inject.name = nameMatch && nameMatch[1];

      if (argDecl && fnText.length) {
        argDecl[2].split(FN_ARG_SPLIT).forEach((arg) => {
          arg.replace(FN_ARG, (all, underscore, name) => $inject.args.push(name));
        });
      }

      fn.$inject = $inject;
    }
  }

  return $inject;
}

//--- end part copied from AngularJS
