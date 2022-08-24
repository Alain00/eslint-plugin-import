# react-first

## Rule Details

This rule aims to place the react import at the first position of the imports list.

Examples of **incorrect** code for this rule:

```js

import { Input } from '@ui/components'
import React from 'react'

```

Examples of **correct** code for this rule:

```js

import React from 'react'
import { Input } from '@ui/components'

```
