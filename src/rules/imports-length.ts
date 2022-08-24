/**
 * @fileoverview break import line into multiple lines
 * @author Alain
 */
"use strict";

import { Rule } from 'eslint'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: "break import line into multiple lines",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [],
    messages: {
      importLineLength: "Import line is too long",
    }
  },

  create(context) {
    const isMultiline = (specifiers) => {
      let isMultiline = true;
      let lastLine = null;
      for (const specifier of specifiers) {
        if (lastLine == null) lastLine = specifier.loc.start.line
        else {
          if (lastLine + 1!= specifier.loc.start.line) {
            isMultiline = false;
            break;
          }
          lastLine = specifier.loc.start.line;
        }
      }
      
      return isMultiline;
    }

    return {
      ImportDeclaration: (node) => {
        if (node.specifiers) {
          const importSpecifiers = node.specifiers.filter(imp => imp.type === 'ImportSpecifier')
          const importDefaultSpecifiers = node.specifiers.filter(imp => imp.type === 'ImportDefaultSpecifier')
          if (importSpecifiers.length >= 3) {
            if (isMultiline(importSpecifiers)) return;
            
            context.report({
              node,
              messageId: 'importLineLength',
              fix(fixer) {
                const source = node.source.value.toString().trim();
                let defaults = importDefaultSpecifiers.map(specifier => specifier.local.name).join(',')
                if (defaults) defaults += ', '
                const specifiers = importSpecifiers.map(specifier => `\n\t${specifier.local.name.trim()}`).join(',');
                return fixer.replaceText(node, `import ${defaults}{${specifiers}\n} from '${source}'`);
              }
            });
          }
        }
      }
    };
  },
} as Rule.RuleModule;
