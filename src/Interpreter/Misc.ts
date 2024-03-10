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
		} else {
			warn("Token is not an operator");
			return 0;
		}
	}

	getAssociativity(): Associativity {
		if (this.tokenType === TokenType.Operator) {
			return operators[this.value as keyof typeof operators].associativity;
		} else {
			warn("Token is not an operator");
			return Associativity.Left;
		}
	}

	isUnary(): boolean {
		if (this.tokenType === TokenType.Operator) {
			return operators[this.value as keyof typeof operators].unary;
		} else {
			warn("Token is not an operator");
			return false;
		}
	}
}

export class ASTNode {
	constructor(
		public nodeType: TokenType,
		public value: string | number,
		public children: ASTNode[] = [],
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

export function isConstant(node: ASTNode): boolean {
	if (node.nodeType === TokenType.Literal) {
		return true;
	} else if (node.nodeType === TokenType.Variable) {
		return false;
	} else if (node.nodeType === TokenType.Operator) {
		if (node.value === "u") return isConstant(node.children[0]);
		return isConstant(node.children[0]) && isConstant(node.children[1]);
	} else if (node.nodeType === TokenType.Function) {
		let constant = true;
		node.children.forEach((child) => {
			constant = constant && isConstant(child);
		});
		return constant;
	}
	return false;
}
