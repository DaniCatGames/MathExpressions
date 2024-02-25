import { Functions } from "./Functions";

enum TokenType {
	Literal = "Literal",
	Variable = "Variable",
	Operator = "Operator",
	Function = "Function",
	FunctionArgumentSeparator = "FunctionArgumentSeparator",
	LeftParenthesis = "LeftParenthesis",
	RightParenthesis = "RightParenthesis",
}

class Token {
	public tokenType: TokenType;
	public value: string | number;

	constructor(tokenType: TokenType, value: string | number) {
		this.tokenType = tokenType;
		this.value = value;
	}
}

export function tokenize(expression: string) {
	const result: Token[] = [];
	const expressionSplit = expression.split("");

	const characterBuffer: string[] = [];
	const numberBuffer: string[] = [];
	expressionSplit.forEach((character) => {
		if (isDigit(character)) {
			numberBuffer.push(character);
		}

		if (isDot(character)) {
			numberBuffer.push(character);
		}

		if (isLetter(character)) {
			if (arrayFull(numberBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				result.push(new Token(TokenType.Operator, "*"));
				numberBuffer.clear();
			}
			characterBuffer.push(character);
		}

		if (isOperator(character)) {
			if (arrayFull(numberBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				numberBuffer.clear();
			} else if (arrayFull(characterBuffer)) {
				const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
				buffer.forEach((char) => {
					if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
					else result.push(new Token(TokenType.Operator, "*"));
				});
				characterBuffer.clear();
			}
			result.push(new Token(TokenType.Operator, character));
		}

		if (isLeftParenthesis(character)) {
			const CBJoined = characterBuffer.join("");
			let isFunction: boolean = false;
			Functions.forEach((func) => {
				if (func.name === CBJoined) {
					isFunction = true;
				}
			});

			if (isFunction) {
				if (
					result[result.size() - 1].tokenType === TokenType.Literal ||
					result[result.size() - 1].tokenType === TokenType.Variable ||
					result[result.size() - 1].tokenType === TokenType.RightParenthesis
				) {
					result.push(new Token(TokenType.Operator, "*"));
				}
				result.push(new Token(TokenType.Function, CBJoined));
				characterBuffer.clear();
			} else {
				if (arrayFull(numberBuffer)) {
					result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
					result.push(new Token(TokenType.Operator, "*"));
					numberBuffer.clear();
				}

				if (arrayFull(characterBuffer)) {
					const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
					buffer.forEach((char) => {
						if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
						else result.push(new Token(TokenType.Operator, char));
					});
					result.push(new Token(TokenType.Operator, "*"));
				}
			}
			result.push(new Token(TokenType.LeftParenthesis, character));
		}

		if (isRightParenthesis(character)) {
			if (arrayFull(numberBuffer) && arrayFull(characterBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				numberBuffer.clear();

				result.push(new Token(TokenType.Operator, "*"));

				const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
				buffer.forEach((char) => {
					if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
					else result.push(new Token(TokenType.Operator, "*"));
				});
				characterBuffer.clear();
			} else if (arrayFull(numberBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				numberBuffer.clear();
			} else if (arrayFull(characterBuffer)) {
				const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
				buffer.forEach((char) => {
					if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
					else result.push(new Token(TokenType.Operator, "*"));
				});
				characterBuffer.clear();
			}

			result.push(new Token(TokenType.RightParenthesis, character));
		}

		if (isComma(character)) {
			if (arrayFull(numberBuffer) && arrayFull(characterBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				numberBuffer.clear();

				result.push(new Token(TokenType.Operator, "*"));

				const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
				buffer.forEach((char) => {
					if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
					else result.push(new Token(TokenType.Operator, "*"));
				});
				characterBuffer.clear();
			} else if (arrayFull(numberBuffer)) {
				result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
				numberBuffer.clear();
			} else if (arrayFull(characterBuffer)) {
				const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
				buffer.forEach((char) => {
					if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
					else result.push(new Token(TokenType.Operator, "*"));
				});
				characterBuffer.clear();
			}

			result.push(new Token(TokenType.FunctionArgumentSeparator, character));
		}
	});

	if (arrayFull(numberBuffer)) {
		result.push(new Token(TokenType.Literal, tonumber(numberBuffer.join("")) as number));
		numberBuffer.clear();
	}

	if (arrayFull(characterBuffer)) {
		const buffer = insertMultiplicationOperatorIntoArray(characterBuffer);
		buffer.forEach((char) => {
			if (isLetter(char)) result.push(new Token(TokenType.Variable, char));
			else result.push(new Token(TokenType.Operator, "*"));
		});
		characterBuffer.clear();
	}

	return result;
}

function arrayFull(array: unknown[]) {
	return array[0] !== undefined;
}

function isDigit(character: string) {
	return character.find("%d")[0] !== undefined;
}

function isLetter(character: string) {
	return character.find("%a")[0] !== undefined;
}

function isOperator(character: string) {
	const operators = "+-*/^";
	return operators.find(character, 1, true)[0] !== undefined;
}

function isLeftParenthesis(character: string) {
	return character === "(";
}

function isRightParenthesis(character: string) {
	return character === ")";
}

function isComma(character: string) {
	return character === ",";
}

function isDot(character: string) {
	return character === ".";
}

function insertMultiplicationOperatorIntoArray(array: string[]) {
	const result = [];
	let i = 0;
	if (i < array.size()) {
		result.push(array[i++]);
	}
	while (i < array.size()) {
		result.push("*", array[i++]);
	}
	return result;
}
