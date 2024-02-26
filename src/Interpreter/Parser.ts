import { Associativity, operators, Token, TokenType } from "./Misc";

export function parse(input: Token[]) {
	const outQueue: Token[] = [];
	const operatorStack: Token[] = [];
	let previousToken: Token | undefined;

	input.forEach((token, index) => {
		if (token.tokenType === TokenType.Literal || token.tokenType === TokenType.Variable) {
			print("LiteralVariable");
			outQueue.push(token);
		} else if (token.tokenType === TokenType.Function) {
			print("Function");
			operatorStack.push(token);
		} else if (token.tokenType === TokenType.FunctionArgumentSeparator) {
			print("FAS");
			if (peek(operatorStack)) {
				while (peek(operatorStack).tokenType !== TokenType.LeftParenthesis) {
					outQueue.push(operatorStack.pop() as Token);
				}
			}
		} else if (token.tokenType === TokenType.Operator) {
			if (
				token.value === "-" &&
				(index === 0 || previousToken?.tokenType === TokenType.Operator || previousToken?.value === "(")
			) {
				print("OperatorUnary");
				if (peek(operatorStack)) {
					for (let i = 0; i < operatorStack.size(); i++) {
						if (
							peek(operatorStack).tokenType === TokenType.Operator &&
							operators.u.precedence < peek(operatorStack).getPrecedence()
						) {
							if (peek(operatorStack)) outQueue.push(operatorStack.pop() as Token);
						} else break;
					}
				}
				operatorStack.push(new Token(TokenType.Operator, "u"));
			} else {
				if (peek(operatorStack)) {
					for (let i = 0; i < operatorStack.size(); i++) {
						const peeked = peek(operatorStack);
						print(peeked);
						if (
							peeked.tokenType !== TokenType.LeftParenthesis &&
							(peeked.getPrecedence() > token.getPrecedence() ||
								(peeked.getPrecedence() === token.getPrecedence() &&
									token.getAssociativity() === Associativity.Left))
						) {
							outQueue.push(operatorStack.pop() as Token);
						} else break;
					}
				}
				operatorStack.push(token);
			}
		} else if (token.tokenType === TokenType.LeftParenthesis) {
			print("(");
			operatorStack.push(token);
		} else if (token.tokenType === TokenType.RightParenthesis) {
			print(")");
			if (peek(operatorStack)) {
				while (peek(operatorStack).tokenType !== TokenType.LeftParenthesis) {
					outQueue.push(operatorStack.pop() as Token);
				}
				operatorStack.pop();
			}
		} else if (peek(operatorStack)) {
			if (peek(operatorStack).tokenType === TokenType.Function) {
				print("Function");
				outQueue.push(operatorStack.pop() as Token);
			}
		}
		previousToken = token;
	});

	return [...outQueue, ...reverseArray(operatorStack)];
}

function peek<T>(array: T[]) {
	return array[array.size() - 1];
}

function reverseArray<T>(array: T[]) {
	const out = [];
	for (let i = array.size() - 1; i >= 0; i--) {
		const valueAtIndex = array[i];

		out.push(valueAtIndex);
	}

	return out;
}
