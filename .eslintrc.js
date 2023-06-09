module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended",
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react", "@typescript-eslint"
	],
	"rules": {
		"react/react-in-jsx-scope": "off",
		"react-hooks/exhaustive-deps": "warn",
		"react/jsx-indent": ["error", "tab"],
		"indent": ["error", "tab"],
		"semi": [2, "always"],
		"array-element-newline": ["error", {
			"ArrayExpression": { "minItems": 5 },
		}]
	}
};
