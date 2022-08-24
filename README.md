# eslint-plugin-imports-length

break import line into multiple lines

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-imports-length`:

```sh
npm install eslint-plugin-imports-length --save-dev
```

## Usage

Add `imports-length` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "imports-length"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "imports-length/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


