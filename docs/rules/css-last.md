# css-last

## Rule Details

This rule aims to place css imports at the last position of the imports list.

Examples of **incorrect** code for this rule:

```js

import { Input } from '@ui/components'
import style from './style.css'
import React from 'react'

```


Examples of **correct** code for this rule:

```js

import { Input } from '@ui/components'
import React from 'react'
import style from './style.css'

```