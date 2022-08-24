# pretty

## Rule Details

This rule aims to style and organize an import declaration splitting it into multiple lines 

Examples of **incorrect** code for this rule:

```js

import React, {
  tuseMemo,
  tuseCallback
} from 'react'

```

```js

import React, {useMemo, useCallback, useEffect} from 'react'

```


```js

import React, {useMemo, 
  useCallback, useEffect
} from 'react'

```

Examples of **correct** code for this rule:

```js

import { Input } from '@ui/components'

```

```js

import {
  useMemo,
  useCallback,
  useEffect
} from 'react'

```
