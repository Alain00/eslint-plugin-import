import { Rule } from 'eslint';
import { ImportDeclaration, Program } from 'estree';

export = {
  meta: {
    type: 'problem',
    docs: {
      description: "Ensure react import is the first",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [],
    messages: {
      notFirst: 'React import must be the first import',
    }
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react') return;

        if (node.parent.type !== 'Program') return;

        const program = node.parent as Program;

        const imports = program.body.filter(node => node.type === 'ImportDeclaration') as ImportDeclaration[];

        const firstImport = imports.sort((a, b) => a.loc.start.line - b.loc.start.line)[0];

        if (firstImport === node) return;

        if (!firstImport) return;

        const sourceCode = context.getSourceCode();
        
        context.report({
          node,
          messageId: 'notFirst',
          fix(fixer) {
            return [
              fixer.insertTextBefore(firstImport, `${sourceCode.getText(node)}\n`),
              fixer.remove(node)
            ]
          }
        });
      }
    }
  },
} as Rule.RuleModule;
