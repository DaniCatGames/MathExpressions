import { Functions } from "./Functions";
import { Token, TokenType } from "./Misc";

export class Tokenizer {
	result: Token[] = [];
	characterBuffer: string[] = [];
	numberBuffer: string[] = [];

	tokenize(expression: string): Token[] {
		expression.split("").forEach((character) => {
			if (this.isDigit(character)) {
				this.numberBuffer.push(character);
			} else if (character === ".") {
				this.numberBuffer.push(character);
			} else if (this.isLetter(character)) {
				this.pushNumberBuffer(true);
				this.characterBuffer.push(character);
			} else if (this.isOperator(character)) {
				if (this.peekNB() !== undefined) {
					this.pushNumberBuffer();
				} else if (this.peekCB() !== undefined) {
					this.pushCharacterBuffer();
				}
				this.result.push(new Token(TokenType.Operator, character));
			} else if (character === "(") {
				const CBJoined = this.characterBuffer.join("");
				let isFunction: boolean = false;
				Functions.forEach((func) => {
					if (func.name === CBJoined) {
						isFunction = true;
					}
				});

				if (isFunction && this.peekResult() !== undefined) {
					if (
						this.peekResult().tokenType === TokenType.Literal ||
						this.peekResult().tokenType === TokenType.Variable ||
						this.peekResult().tokenType === TokenType.RightParenthesis
					) {
						this.result.push(new Token(TokenType.Operator, "*"));
					}
					this.result.push(new Token(TokenType.Function, CBJoined));
					this.characterBuffer.clear();
				} else {
					this.pushBothBuffers();
				}
				this.result.push(new Token(TokenType.LeftParenthesis, character));
			} else if (character === ")") {
				this.pushBothBuffers();
				this.result.push(new Token(TokenType.RightParenthesis, character));
			} else if (character === ",") {
				this.pushBothBuffers();
				this.result.push(new Token(TokenType.FunctionArgumentSeparator, character));
			} else {
				warn("Character not defined.");
			}
		});

		this.pushBothBuffers();

		return this.result;
	}

	pushBothBuffers() {
		if (this.peekNB() !== undefined && this.peekCB() !== undefined) {
			this.pushNumberBuffer(true);
			this.pushCharacterBuffer();
		} else {
			this.pushNumberBuffer();
			this.pushCharacterBuffer();
		}
	}

	pushNumberBuffer(pushMultiplication?: boolean) {
		if (this.peekNB() !== undefined) {
			this.result.push(new Token(TokenType.Literal, tonumber(this.numberBuffer.join("")) as number));
			this.numberBuffer.clear();
			if (pushMultiplication) this.result.push(new Token(TokenType.Operator, "*"));
		} else {
			warn("Number Buffer is empty.");
		}
	}

	pushCharacterBuffer(pushMultiplication?: boolean) {
		if (this.peekCB() !== undefined) {
			const buffer = insertCharacterInArray(this.characterBuffer, "*");
			buffer.forEach((char) => {
				if (this.isLetter(char)) this.result.push(new Token(TokenType.Variable, char));
				else this.result.push(new Token(TokenType.Operator, "*"));
			});
			this.characterBuffer.clear();
			if (pushMultiplication) this.result.push(new Token(TokenType.Operator, "*"));
		} else {
			warn("Character Buffer is empty.");
		}
	}

	peekNB() {
		return this.numberBuffer[this.numberBuffer.size() - 1];
	}

	peekCB() {
		return this.characterBuffer[this.characterBuffer.size() - 1];
	}

	peekResult() {
		return this.result[this.result.size() - 1];
	}

	isDigit(character: string) {
		return character.find("%d")[0] !== undefined;
	}

	isLetter(character: string) {
		return character.find("%a")[0] !== undefined;
	}

	isOperator(character: string) {
		const operators = "+-*/^";
		return operators.find(character, 1, true)[0] !== undefined;
	}
}

function insertCharacterInArray(array: string[], character: string) {
	const result = [];
	let i = 0;
	if (i < array.size()) {
		result.push(array[i++]);
	}
	while (i < array.size()) {
		result.push(character, array[i++]);
	}
	return result;
}
