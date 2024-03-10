import { ASTNode, TokenType } from "./Misc";
import { Functions } from "./Functions";

export class Evaluator {
	constructor(private variables: [string, number][] = []) {}

	visit(node: ASTNode): number {
		switch (node.nodeType) {
			case TokenType.Literal:
				return this.visitLiteral(node);
			case TokenType.Variable:
				return this.visitVariable(node);
			case TokenType.Operator:
				if (node.value === "u") {
					return this.visitUnary(node) as number;
				} else {
					return this.visitBinary(node) as number;
				}
			case TokenType.Function:
				return this.visitFunction(node) as number;
			default:
				return 0;
		}
	}

	visitLiteral(node: ASTNode) {
		return node.value as number;
	}

	visitVariable(node: ASTNode) {
		let value;
		this.variables.forEach((variable) => {
			if (node.value === variable[0]) {
				value = variable[1];
			}
		});
		if (!value) {
			warn("Variable not found, returning 0.");
			value = 0;
		}
		return value;
	}

	visitUnary(node: ASTNode) {
		if (node.children[0]) {
			return -this.visit(node.children[0]);
		} else {
			warn("Unary node does not have any arguments.");
		}
	}

	visitBinary(node: ASTNode) {
		switch (node.value) {
			case "+":
				if (!node.children[0] || !node.children[1]) return;
				return this.visit(node.children[0]) + this.visit(node.children[1]);
			case "-":
				if (!node.children[0] || !node.children[1]) return;
				return this.visit(node.children[0]) - this.visit(node.children[1]);
			case "*":
				if (!node.children[0] || !node.children[1]) return;
				return this.visit(node.children[0]) * this.visit(node.children[1]);
			case "/":
				if (!node.children[0] || !node.children[1]) return;
				return this.visit(node.children[0]) / this.visit(node.children[1]);
			case "^":
				if (!node.children[0] || !node.children[1]) return;
				return this.visit(node.children[0]) ** this.visit(node.children[1]);
			default:
				return warn("Operator is not recognised.");
		}
	}

	visitFunction(node: ASTNode) {
		for (const item of Functions) {
			if (node.value === item.name) {
				if (!node.children[1]) return warn("Function does not have any arguments.");
				return item.function(this.visit(node.children[0]));
			}
		}
	}
}
