# sort-interface

## Rule Details

This rule aims to keep interface properties to be alphabetically sorted

Examples of **incorrect** code for this rule:

```ts

interface Cat {
  eat: () => void;
  name: string;
  age: string;
  sleep(): void;
}

```

```ts

interface Cat {
  sleep(): Foo
  age: string;
}

```

Examples of **correct** code for this rule:

```ts

interface Cat {
  age: string;
  name: string;
  eat: () => void;
  sleep(): void;
}

```

```ts

interface Foo {
  a: number;
  b: string[];
  c: () => Foo[];
}

```