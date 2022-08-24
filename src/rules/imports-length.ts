/**
 * @fileoverview break import line into multiple lines
 * @author Alain
 */
"use strict";

import { Rule } from 'eslint'
import { ImportDeclaration, ImportDefaultSpecifier, ImportSpecifier } from 'estree';

export = {
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
      importLineLong: "Import line is too long. Split into multiple lines",
      importLineShort: "Unnecesary split of imports. Merge into one line",
    }
  },

  create(context) {
    const isDefaultSpecifierAtStart = (node: ImportDeclaration, specifiers: ImportDefaultSpecifier[]) => {
      for (const specifier of specifiers) {
        if (node.loc.start.line !== specifier.loc.start.line) {
          // default must be at start of the import
          return false;
        }
      }
      
      return true;
    }

    const areSplited = (node: ImportDeclaration, specifiers: ImportSpecifier[], defaultSpecifiers: ImportDefaultSpecifier[]) => {
      let lastLine = null;
      const allSpecifiers : (ImportSpecifier | ImportDefaultSpecifier)[] = [...specifiers, ...defaultSpecifiers];
      for (const specifier of allSpecifiers) {
        if (lastLine === null) lastLine = specifier.loc.start.line
        else if (lastLine !== specifier.loc.start.line) {
          return true;
        }
      }

      return false;
    }

    const arePerfectlySplited = (node: ImportDeclaration, specifiers: ImportSpecifier[], defaultSpecifiers: ImportDefaultSpecifier[]) => {
      const areDefaultsAtStart = defaultSpecifiers.every(specifier => specifier.loc.start.line === node.loc.start.line);
      let lastLine = null;
      for (const specifier of specifiers) {
        if (lastLine != null && lastLine + 1 !== specifier.loc.start.line) {
          return false;
        }

        if (specifier.loc.start.line === node.loc.start.line) return false;
        if (specifier.loc.end.line === node.loc.end.line) return false;

        lastLine = specifier.loc.start.line;
      }

      return true && areDefaultsAtStart;
    }

    return {
      ImportDeclaration: (node) => {
        if (node.specifiers) {
          const importSpecifiers = node.specifiers.filter(imp => imp.type === 'ImportSpecifier') as ImportSpecifier[]
          const importDefaultSpecifiers = node.specifiers.filter(imp => imp.type === 'ImportDefaultSpecifier') as ImportDefaultSpecifier[]
          if (importSpecifiers.length >= 3) {
            if (arePerfectlySplited(node, importSpecifiers, importDefaultSpecifiers)) return;
            
            context.report({
              node,
              messageId: 'importLineLong',
              fix(fixer) {
                const source = node.source.value.toString().trim();

                let defaults = importDefaultSpecifiers.map(specifier => specifier.local.name).join(',')
                if (defaults) defaults += ', '

                const specifiers = importSpecifiers
                  .sort((a,b) => a.local.name.localeCompare(b.local.name))
                  .map(specifier => `\n\t${specifier.local.name.trim()}`).join(',');

                return fixer.replaceText(node, `import ${defaults}{${specifiers}\n} from '${source}'`);
              }
            });
          } else {
            if (importSpecifiers.length === 0 && isDefaultSpecifierAtStart(node, importDefaultSpecifiers)) return;
            if (areSplited(node, importSpecifiers, importDefaultSpecifiers)) {
              context.report({
                node,
                messageId: 'importLineShort',
                fix(fixer) {
                  const source = node.source.value.toString().trim();
                  
                  let defaults = importDefaultSpecifiers.map(specifier => specifier.local.name).join(',')
                  if (defaults) defaults += ', '
                 
                  const specifiers = importSpecifiers
                    .sort((a,b) => a.local.name.localeCompare(b.local.name))
                    .map(specifier => specifier.local.name.trim()).join(', ');

                  return fixer.replaceText(node, `import ${defaults}{ ${specifiers} } from '${source}'`);
                }
              });
            }
          }
        }
      }
    };
  },
} as Rule.RuleModule;
