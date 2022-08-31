import { Rule } from 'eslint';
import { Program, ArrowFunctionExpression, FunctionDeclaration, Expression, PrivateIdentifier, ObjectPattern, RestElement, AssignmentProperty } from 'estree';

export = {
  meta: {
    type: 'problem',
    docs: {
      description: "Ensure function params are alphabetically sorted",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        functionsLast: {
          type: 'boolean'
        }
      }
    }],
    messages: {
      notSorted: 'Function params must be sorted',
    }
  },

  create(context) {
    const configuration = context.options[0] || {};
    const functionsLast: boolean = configuration.functionsLast ?? true

    const sourceCode = context.getSourceCode();

    const isFunction = (prop: AssignmentProperty) => {
      if (prop.value.type === 'AssignmentPattern') {
        return prop.value.right.type === 'ArrowFunctionExpression' || 
          prop.value.right.type === 'FunctionExpression'
      }
      return false;
    }

    const getKeyName = (key: Expression | PrivateIdentifier) => {
      if (key.type === "Identifier"){
        return key.name;
      }
      throw new Error("Key no supported")
    }

    const compareProperties = (a: AssignmentProperty, b: AssignmentProperty) => {
      const aKeyName = getKeyName(a.key)
      const bKeyName = getKeyName(b.key)

      if (functionsLast) {
        const aIsFunction = isFunction(a);
        const bIsFunction = isFunction(b);
        if (aIsFunction && !bIsFunction) return 1
        if (bIsFunction && !aIsFunction) return -1;
      }

      if (aKeyName > bKeyName) return 1;
      if (aKeyName < bKeyName) return -1;
      return 0;
    }

    const verifyObjectProperties = (objectPattern: ObjectPattern) => {
      const assigments = objectPattern.properties.filter(prop => prop.type === 'Property') as AssignmentProperty[]
      const sortedProps = [...assigments].sort(compareProperties)

      for (const index in assigments) {
        if (assigments[index] != sortedProps[index]) {
          // const sortedLocation = sortedProps.find(prop => prop === assigments[index]).loc
          context.report({
            node: assigments[index],
            messageId: 'notSorted',
            *fix(fixer) {
              yield fixer.replaceText(assigments[index], sourceCode.getText(sortedProps[index]))
              yield fixer.replaceText(sortedProps[index], sourceCode.getText(assigments[index]))
            }
          })
        }
      }
    }

    const verifyFunction = (node: FunctionDeclaration | ArrowFunctionExpression) => {
      const objectPatterns = node.params.filter(node => node.type === 'ObjectPattern') as ObjectPattern[]
        if (objectPatterns.length > 0) {
          for (const objectPattern of objectPatterns) {
            verifyObjectProperties(objectPattern)
          }
        }
    }

    return {
      FunctionDeclaration(node) {
        verifyFunction(node)
      },
      ArrowFunctionExpression(node) {
        verifyFunction(node)
      }
    }
  },
} as Rule.RuleModule;
