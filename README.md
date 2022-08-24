# eslint-plugin-import

break import line into multiple lines

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-import`:

```sh
npm install @alain00/eslint-plugin-import --save-dev
```

## Usage

Add `@alain00/import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@alain00/import"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@alain00/import/pretty": 2
    }
}
```

## Supported Rules

* Ensure an import declaration have the specifiers splitted into multiple lines. ([`pretty`])

[`imports-length`]: ./docs/rules/pretty.md

