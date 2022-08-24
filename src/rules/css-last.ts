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

    const isCssImport = (source: string) => {
      return /\.css/.test(source);
    }

    return {
      ImportDeclaration(node) {
        if (!isCssImport(node.source.raw)) return;

        if (node.parent.type !== 'Program') return;

        const program = node.parent as Program;

        const imports = program.body.filter(node => node.type === 'ImportDeclaration') as ImportDeclaration[];

        const lastImport = imports
          .filter(imp => !isCssImport(imp.source.raw))
          .sort((a, b) => b.loc.start.line - a.loc.start.line)[0];

        if (!lastImport) return;

        if (lastImport.loc.start.line < node.loc.start.line) return;

        const sourceCode = context.getSourceCode();
        
        context.report({
          node,
          messageId: 'notLast',
          *fix(fixer) {
            yield fixer.insertTextAfter(lastImport, `\n${sourceCode.getText(node)}`)
            yield fixer.remove(node)
          }
        });
      }
    }
  },
} as Rule.RuleModule;
