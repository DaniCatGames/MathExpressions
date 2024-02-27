import { ASTNode, TokenType } from "./Misc";
import { Functions } from "./Functions";

export class Evaluator {
	constructor(private variables: [string, number][] = []) {}

	visit(node: ASTNode): number {
		switch (node.nodeType) {
			case TokenType.Literal:
				return this.visitLiteral(node);
			case TokenType.Variable:
				return this.visitVariable(node) as number;
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
		let value = 0;
		this.variables.forEach((variable) => {
			if (node.value === variable[0]) {
				value = variable[1];
			}
		});
		return value;
	}

	visitUnary(node: ASTNode) {
		if (node.leftChildNode) {
			return -this.visit(node.leftChildNode);
		}
	}

	visitBinary(node: ASTNode) {
		switch (node.value) {
			case "+":
				if (!node.leftChildNode || !node.rightChildNode) return;
				return this.visit(node.leftChildNode) + this.visit(node.rightChildNode);
			case "-":
				if (!node.leftChildNode || !node.rightChildNode) return;
				return this.visit(node.leftChildNode) - this.visit(node.rightChildNode);
			case "*":
				if (!node.leftChildNode || !node.rightChildNode) return;
				return this.visit(node.leftChildNode) * this.visit(node.rightChildNode);
			case "/":
				if (!node.leftChildNode || !node.rightChildNode) return;
				return this.visit(node.leftChildNode) / this.visit(node.rightChildNode);
			case "^":
				if (!node.leftChildNode || !node.rightChildNode) return;
				return this.visit(node.leftChildNode) ** this.visit(node.rightChildNode);
			default:
				return;
		}
	}

	visitFunction(node: ASTNode) {
		for (const item of Functions) {
			if (node.value === item.name) {
				if (!node.leftChildNode) return;
				return item.function(this.visit(node.leftChildNode));
			}
		}
	}
}
