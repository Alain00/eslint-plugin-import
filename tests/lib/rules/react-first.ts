import rule from '../../../src/rules/react-first'
import { RuleTester } from 'eslint'

const notFirstMessage = rule.meta?.messages?.notFirst;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
ruleTester.run("react-first", rule, {
  valid: [
    {
      code: "import React from 'react'\nimport { Input } from '@ui/components'",
    },
    {
      code: "import React from 'react'",
    },
  ],

  invalid: [
    {
      code: "import { Input } from '@ui/components'\nimport React from 'react'",
      errors: [{ message: notFirstMessage, type: "ImportDeclaration",}],
      output: "import React from 'react'\nimport { Input } from '@ui/components'\n"
    },
  ],
});
