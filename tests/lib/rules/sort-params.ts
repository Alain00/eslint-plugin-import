import rule from '../../../src/rules/sort-params'
import { RuleTester } from 'eslint'

const notSortedMessage = rule.meta?.messages?.notSorted;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
ruleTester.run("sort-params", rule, {
  valid: [
    {
      code: `
        function getName({
          age,
          name
        }) {
          return name;
        }
      `,
    },
    {
      code: `
        function notify({
          text = 'This is a notification',
          title = 'Hello!',
          callback = () => {return;},
        }) { }
      `
    },
    {
      code: `
        const getName = ({
          age = 12,
          name
        }) => {
          return name;
        }
      `
    }
  ],

  invalid: [
    {
      
      code: `
        function getName({
          name,
          age
        }) {
          return name;
        }
      `,
      errors: [
        { message: notSortedMessage, type: "Property"},
        { message: notSortedMessage, type: "Property"}
      ],
      output: `
        function getName({
          age,
          name
        }) {
          return name;
        }
      `
    },
    {
      code: `
        const getName = ({
          zoo = 'Foo',
          name,
          age
        }) => {
          return name;
        }
      `,
      errors: [
        { message: notSortedMessage, type: "Property"},
        { message: notSortedMessage, type: "Property"}
      ],
      output: `
        const getName = ({
          age,
          name,
          zoo = 'Foo'
        }) => {
          return name;
        }
      `
    },
  ],
});
