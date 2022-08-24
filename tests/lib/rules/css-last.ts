import rule from '../../../src/rules/css-last'
import { RuleTester } from 'eslint'

const notLastMessage = rule.meta?.messages?.notLast;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
ruleTester.run("css-last", rule, {
  valid: [
    {
      code: "import React from 'react'\nimport { Input } from '@ui/components'\nimport style from './style.css'",
    },
    {
      code: "import style from './style.css'",
    },
  ],

  invalid: [
    {
      code: "import style from './style.css'\nimport { Input } from '@ui/components'\nimport React from 'react'",
      errors: [{ message: notLastMessage, type: "ImportDeclaration",}],
      output: "\nimport { Input } from '@ui/components'\nimport React from 'react'\nimport style from './style.css'"
    }
  ],
});
