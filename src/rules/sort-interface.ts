import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { Identifier } from 'estree'

export = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    docs: {
      description: "Ensure interface properties are alphabetically sorted",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [],
    messages: {
      notSorted: 'Interface properties must be sorted',
    }
  },
  defaultOptions: [],
  create(context) {
    const configuration = context.options[0] || {};
    const functionsLast: boolean = configuration.functionsLast ?? true

    const sourceCode = context.getSourceCode();

    type InterfaceProperty = TSESTree.TSPropertySignature | TSESTree.TSMethodSignature

    const isFunction = (prop: InterfaceProperty) => {
      if (prop.type === AST_NODE_TYPES.TSPropertySignature && prop.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSFunctionType) {
        return true;
      }
      if (prop.type === AST_NODE_TYPES.TSMethodSignature) return true;

      return false;
    }

    const getKeyName = (key: InterfaceProperty['key']) => {
      if (key.type === "Identifier"){
        return key.name;
      }
      throw new Error("Key no supported")
    }

    const compareProperties = (a: InterfaceProperty, b: InterfaceProperty) => {
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

    const verifyObjectProperties = (properties: InterfaceProperty[]) => {
      const sortedProps = [...properties].sort(compareProperties)

      for (const index in properties) {
        if (properties[index] != sortedProps[index]) {
          // const sortedLocation = sortedProps.find(prop => prop === properties[index]).loc
          context.report({
            node: properties[index],
            messageId: 'notSorted',
            *fix(fixer) {
              yield fixer.replaceText(properties[index], sourceCode.getText(sortedProps[index]))
              yield fixer.replaceText(sortedProps[index], sourceCode.getText(properties[index]))
            }
          })
        }
      }
    }

    const verifyInteface = (node: TSESTree.TSInterfaceDeclaration) => {
      const properties = node.body.body.filter(
        node => node.type === AST_NODE_TYPES.TSPropertySignature || node.type === AST_NODE_TYPES.TSMethodSignature
      ) as InterfaceProperty[]
      if (properties.length > 0) {
        verifyObjectProperties(properties)
      }
    }

    return {
      TSInterfaceDeclaration(node) {
        verifyInteface(node)
      }
    }
  },
})
