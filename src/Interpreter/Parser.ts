import { Associativity, ASTNode, Token, TokenType } from "./Misc";

export class Parser {
	outStack: ASTNode[] = [];
	operatorStack: Token[] = [];

	constructor() {}

	parse(input: Token[]) {
		let previousToken: Token | undefined;

		input.forEach((token, index) => {
			if (token.tokenType === TokenType.Literal) {
				this.outStack.push(new ASTNode(TokenType.Literal, token.value));
			} else if (token.tokenType === TokenType.Variable) {
				this.outStack.push(new ASTNode(TokenType.Variable, token.value));
			} else if (token.tokenType === TokenType.Function) {
				this.operatorStack.push(token);
			} else if (token.tokenType === TokenType.FunctionArgumentSeparator) {
				if (this.peekOperatorStack()) {
					while (this.peekOperatorStack().tokenType !== TokenType.LeftParenthesis) {
						this.operatorStackPop();
					}
				}
			} else if (token.tokenType === TokenType.Operator) {
				if (
					token.value === "-" &&
					(index === 0 || previousToken?.tokenType === TokenType.Operator || previousToken?.value === "(")
				) {
					if (this.peekOperatorStack()) {
						for (let i = 0; i < this.operatorStack.size(); i++) {
							if (token.getPrecedence() < this.peekOperatorStack().getPrecedence()) {
								this.operatorStackPop();
							} else break;
						}
					}
					this.operatorStack.push(new Token(TokenType.Operator, "u"));
				} else {
					if (this.peekOperatorStack()) {
						for (let i = 0; i <= this.operatorStack.size(); i++) {
							const peeked = this.peekOperatorStack();
							if (
								(token.getAssociativity() === Associativity.Left &&
									token.getPrecedence() <= peeked.getPrecedence()) ||
								(token.getAssociativity() === Associativity.Right &&
									token.getPrecedence() < peeked.getPrecedence())
							) {
								this.operatorStackPop();
							} else break;
						}
					}
					this.operatorStack.push(token);
				}
			} else if (token.tokenType === TokenType.LeftParenthesis) {
				this.operatorStack.push(token);
			} else if (token.tokenType === TokenType.RightParenthesis) {
				if (this.peekOperatorStack()) {
					while (this.peekOperatorStack().tokenType !== TokenType.LeftParenthesis) {
						this.operatorStackPop();
					}
					this.operatorStack.pop();
				}
			} else if (this.peekOperatorStack()) {
				if (this.peekOperatorStack().tokenType === TokenType.Function) {
					this.operatorStackPop();
				}
			}
			previousToken = token;
		});

		this.reverseOperatorStack();
		while (this.peekOperatorStack()) this.operatorStackPop();

		const out = this.outStack[0];
		this.outStack.clear();
		this.operatorStack.clear();
		return out;
	}

	private peekOperatorStack() {
		return this.operatorStack[this.operatorStack.size() - 1];
	}

	private operatorStackPop() {
		const operator = this.operatorStack.pop() as Token;
		if (operator.isUnary()) {
			const leftNode = this.outStack.pop();
			this.outStack.push(new ASTNode(operator.tokenType, operator.value, leftNode));
		} else {
			const leftNode = this.outStack.pop();
			const rightNode = this.outStack.pop();
			this.outStack.push(new ASTNode(operator.tokenType, operator.value, rightNode, leftNode));
		}
	}

	private reverseOperatorStack() {
		const out = [];
		for (let i = this.operatorStack.size() - 1; i >= 0; i--) {
			const valueAtIndex = this.operatorStack[i];

			out.push(valueAtIndex);
		}

		this.operatorStack = out;
	}
}
