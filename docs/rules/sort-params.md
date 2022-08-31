# sort-params

## Rule Details

This rule aims to keep function objects params have properties alphabetically sorted

Examples of **incorrect** code for this rule:

```js

function getName({
  name,
  age
}) {
  return name;
}

```

```js

const getName = ({
  zoo = 'Foo',
  name,
  age
}) => {
  return name;
}

```

Examples of **correct** code for this rule:

```js

function getName({
  age,
  name
}) {
  return name;
}

```

```js

function notify({
  text = 'This is a notification',
  title = 'Hello!',
  callback = () => {return;},
}) { }

```