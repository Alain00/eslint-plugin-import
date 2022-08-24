import { Rule } from 'eslint';
import { ImportDeclaration, Program } from 'estree';

export = {
  meta: {
    type: 'problem',
    docs: {
      description: "Ensure css import is the last",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [],
    messages: {
      notLast: 'Imports of css files must be the last',
    }
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (!(/\.css/.test(node.source.raw))) return;

        if (node.parent.type !== 'Program') return;

        const program = node.parent as Program;

        const imports = program.body.filter(node => node.type === 'ImportDeclaration') as ImportDeclaration[];

        const lastImport = imports.sort((a, b) => b.loc.start.line - a.loc.start.line)[0];

        if (lastImport === node) return;

        if (!lastImport) return;

        const sourceCode = context.getSourceCode();
        
        context.report({
          node,
          messageId: 'notLast',
          fix(fixer) {
            return [
              fixer.insertTextAfter(lastImport, `\n${sourceCode.getText(node)}`),
              fixer.remove(node)
            ]
          }
        });
      }
    }
  },
} as Rule.RuleModule;
