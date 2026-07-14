module.exports = {
  presets: [
    ["@babel/preset-env", { 
      targets: { node: "current" },
      modules: "auto"
    }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    // Transform import.meta.env to process.env for Jest compatibility
    function importMetaEnvPlugin() {
      return {
        visitor: {
          MemberExpression(path) {
            // Transform import.meta.env to process.env
            if (
              path.node.object.type === 'MetaProperty' &&
              path.node.object.meta.name === 'import' &&
              path.node.object.property.name === 'meta' &&
              path.node.property.name === 'env'
            ) {
              path.replaceWith({
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'process'
                },
                property: {
                  type: 'Identifier',
                  name: 'env'
                },
                computed: false
              });
            }
          }
        }
      };
    }
  ],
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { 
          targets: { node: "current" },
          modules: "commonjs"
        }],
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        // Transform import.meta.env to process.env for Jest compatibility
        function importMetaEnvPlugin() {
          return {
            visitor: {
              MemberExpression(path) {
                // Transform import.meta.env to process.env
                if (
                  path.node.object.type === 'MetaProperty' &&
                  path.node.object.meta.name === 'import' &&
                  path.node.object.property.name === 'meta' &&
                  path.node.property.name === 'env'
                ) {
                  path.replaceWith({
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'process'
                    },
                    property: {
                      type: 'Identifier',
                      name: 'env'
                    },
                    computed: false
                  });
                }
              }
            }
          };
        }
      ],
    },
  },
};
