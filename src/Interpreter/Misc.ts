export enum TokenType {
	Literal = "Literal",
	Variable = "Variable",
	Operator = "Operator",
	Function = "Function",
	FunctionArgumentSeparator = "FunctionArgumentSeparator",
	LeftParenthesis = "LeftParenthesis",
	RightParenthesis = "RightParenthesis",
}

export class Token {
	public tokenType: TokenType;
	public value: string | number;

	constructor(tokenType: TokenType, value: string | number) {
		this.tokenType = tokenType;
		this.value = value;
	}

	getPrecedence(): number {
		if (this.tokenType === TokenType.Operator) {
			return operators[this.value as keyof typeof operators].precedence;
		} else return 0;
	}

	getAssociativity(): Associativity {
		if (this.tokenType === TokenType.Operator) {
			return operators[this.value as keyof typeof operators].associativity;
		} else return Associativity.Left;
	}

	isUnary(): boolean {
		if (this.tokenType === TokenType.Operator) {
			return operators[this.value as keyof typeof operators].unary;
		} else return false;
	}
}

export class ASTNode {
	constructor(
		public nodeType: TokenType,
		public value: string | number,
		public leftChildNode?: ASTNode,
		public rightChildNode?: ASTNode,
	) {}
}

export enum Associativity {
	Left,
	Right,
}

export const operators = {
	u: {
		associativity: Associativity.Right,
		precedence: 4,
		unary: true,
	},
	"^": {
		associativity: Associativity.Right,
		precedence: 4,
		unary: false,
	},
	"*": {
		associativity: Associativity.Left,
		precedence: 3,
		unary: false,
	},
	"/": {
		associativity: Associativity.Left,
		precedence: 3,
		unary: false,
	},
	"+": {
		associativity: Associativity.Left,
		precedence: 2,
		unary: false,
	},
	"-": {
		associativity: Associativity.Left,
		precedence: 2,
		unary: false,
	},
};
