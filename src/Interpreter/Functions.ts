import { ASTNode, TokenType } from "./Misc";

export interface Function {
	name: string;
	function: (...inputs: number[]) => number;
	arguments: number;
	derivative: (nodes: ASTNode[]) => ASTNode;
}

export const Functions: Function[] = [
	//Trigonometric Functions
	{
		name: "sin",
		function: (x: number) => {
			return math.sin(x);
		},
		arguments: 1,
		derivative: ([x]) => {
			return new ASTNode(TokenType.Function, "cos", [x]);
		},
	},
	{
		name: "cos",
		function: (x: number) => {
			return math.cos(x);
		},
		arguments: 1,
		derivative: ([x]) => {
			return new ASTNode(TokenType.Operator, "u", [new ASTNode(TokenType.Function, "sin", [x])]);
		},
	},
	{
		name: "tan",
		function: (x: number) => {
			return math.tan(x);
		},
		arguments: 1,
		derivative: ([x]) => {
			return new ASTNode(TokenType.Operator, "+", [
				new ASTNode(TokenType.Operator, "^", [
					new ASTNode(TokenType.Function, "tan", [x]),
					new ASTNode(TokenType.Literal, 2),
				]),
			]);
		},
	},

	//Logarithms
	{
		name: "ln",
		function: (x: number) => {
			return math.log(x);
		},
		arguments: 1,
		derivative: ([x]) => {
			return new ASTNode(TokenType.Operator, "/", [new ASTNode(TokenType.Literal, 1), x]);
		},
	},
	{
		name: "log",
		function: (x: number, base: number) => {
			return math.log(x, base);
		},
		arguments: 2,
		derivative: ([x, base]) => {
			return new ASTNode(TokenType.Operator, "/", [
				new ASTNode(TokenType.Literal, 1),
				new ASTNode(TokenType.Operator, "*", [x, new ASTNode(TokenType.Function, "ln", [base])]),
			]);
		},
	},
];
