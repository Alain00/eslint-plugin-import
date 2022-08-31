import rule from '../../../src/rules/sort-interface'
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const notSortedMessage = rule.meta?.messages?.notSorted;

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

ruleTester.run("sort-interface", rule, {
  valid: [
    {
      code: `
        interface Cat {
          age: string;
          name: string;
          eat: () => void;
          sleep(): void;
        }
      `,
    },
    {
      code: `
        interface Foo {
          a: number;
          b: string[];
          c: () => Foo[];
        }
      `,
    },
  ],

  invalid: [
    {
      code: `
        interface Cat {
          eat: () => void;
          name: string;
          age: string;
          sleep(): void;
        }
      `,
      errors: [
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSPropertySignature},
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSPropertySignature},
      ],
      output: `
        interface Cat {
          age: string;
          name: string;
          eat: () => void;
          sleep(): void;
        }
      `
    },
    {
      code: `
        interface Cat {
          sleep(): Foo
          age: string;
        }
      `,
      errors: [
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSMethodSignature},
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSPropertySignature},
      ],
      output: `
        interface Cat {
          age: string;
          sleep(): Foo
        }
      `
    },
    {
      code: `
        interface Foo {
          a: number;
          c: () => Foo[];
          b: string[];
        }
      `,
      errors: [
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSPropertySignature},
        { messageId: 'notSorted', type: AST_NODE_TYPES.TSPropertySignature},
      ],
      output: `
        interface Foo {
          a: number;
          b: string[];
          c: () => Foo[];
        }
      `,
    }
  ],
});
