import rule from '../../../src/rules/pretty'
import { RuleTester } from 'eslint'


const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
const importLineLongMessage = rule.meta?.messages?.importLineLong;
const importLineShortMessage = rule.meta?.messages?.importLineShort;


ruleTester.run("pretty", rule, {
  valid: [
    {
      code: "import { Input } from '@ui/components'",
    },
    {
      code: "import {\n\tuseMemo,\n\tuseCallback,\n\tuseEffect\n} from 'react'"
    },
    {
      code: "import React, {useMemo, useCallback} from 'react'",
    },
    {
      code: "import {Input, Canvas} from '@ui/components'"
    },
    {
      code: "import Components from '@ui/components'"
    }
  ],

  invalid: [
    {
      code: "import { useMemo, useCallback, useEffect } from 'react'",
      errors: [{ message: importLineLongMessage, type: "ImportDeclaration",}],
      output: "import {\n\tuseMemo,\n\tuseCallback,\n\tuseEffect\n} from 'react'"
    },
    {
      code: "import {useMemo, useCallback, useEffect, Component, Element, HTMLElement} from './some/dir'",
      errors: [{ message: importLineLongMessage, type: "ImportDeclaration",}],
      output: "import {\n\tuseMemo,\n\tuseCallback,\n\tuseEffect,\n\tComponent,\n\tElement,\n\tHTMLElement\n} from './some/dir'"
    },
    {
      code: "import React, {useMemo, useCallback, useEffect} from 'react'",
      errors: [{ message: importLineLongMessage, type: "ImportDeclaration",}],
      output: "import React, {\n\tuseMemo,\n\tuseCallback,\n\tuseEffect\n} from 'react'"
    },
    {
      code: "import React, {useMemo, useCallback,\n\tuseEffect} from 'react'",
      errors: [{ message: importLineLongMessage, type: "ImportDeclaration",}],
      output: "import React, {\n\tuseMemo,\n\tuseCallback,\n\tuseEffect\n} from 'react'"
    },
    {
      code: "import React, {\n\tuseMemo,\n\tuseCallback\n} from 'react'",
      errors: [{ message: importLineShortMessage, type: "ImportDeclaration",}],
      output: "import React, { useMemo, useCallback } from 'react'"
    },
    {
      code: "import React, { useMemo,\n\tuseCallback\n} from 'react'",
      errors: [{ message: importLineShortMessage, type: "ImportDeclaration",}],
      output: "import React, { useMemo, useCallback } from 'react'"
    },
    {
      code: "import React, { \n\tuseEffect,\n\tuseMemo,\n\tuseLayoutEffect } from 'react'",
      errors: [{ message: importLineLongMessage, type: "ImportDeclaration",}],
      output: "import React, {\n\tuseEffect,\n\tuseMemo,\n\tuseLayoutEffect\n} from 'react'"
    }
  ],
});
