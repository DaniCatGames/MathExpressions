import { ASTNode, isConstant, TokenType } from "./Misc";
import { Function, Functions } from "./Functions";

export class Differentiator {
	differentiate(node: ASTNode): ASTNode {
		if (node.nodeType === TokenType.Literal) {
			return new ASTNode(TokenType.Literal, 0);
		} else if (node.nodeType === TokenType.Variable) {
			return new ASTNode(TokenType.Literal, 1);
		} else if (node.nodeType === TokenType.Operator && node.value === "+") {
			return new ASTNode(TokenType.Operator, "+", [
				this.differentiate(node.children[0]),
				this.differentiate(node.children[1]),
			]);
		} else if (node.nodeType === TokenType.Operator && node.value === "-") {
			return new ASTNode(TokenType.Operator, "-", [
				this.differentiate(node.children[0]),
				this.differentiate(node.children[1]),
			]);
		} else if (node.nodeType === TokenType.Operator && node.value === "*") {
			return new ASTNode(TokenType.Operator, "+", [
				new ASTNode(TokenType.Operator, "*", [this.differentiate(node.children[0]), node.children[1]]),
				new ASTNode(TokenType.Operator, "*", [node.children[0], this.differentiate(node.children[1])]),
			]);
		} else if (node.nodeType === TokenType.Operator && node.value === "/") {
			return new ASTNode(TokenType.Operator, "/", [
				new ASTNode(TokenType.Operator, "-", [
					new ASTNode(TokenType.Operator, "*", [this.differentiate(node.children[0]), node.children[1]]),
					new ASTNode(TokenType.Operator, "*", [node.children[0], this.differentiate(node.children[1])]),
				]),
				new ASTNode(TokenType.Operator, "*", [node.children[1], new ASTNode(TokenType.Literal, 2)]),
			]);
		} else if (node.nodeType === TokenType.Operator && node.value === "^") {
			if (isConstant(node.children[1])) {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(TokenType.Operator, "*", [
						new ASTNode(TokenType.Literal, node.children[1].value),
						this.differentiate(node.children[0]),
					]),
					new ASTNode(TokenType.Operator, "^", [
						node.children[0],
						new ASTNode(TokenType.Literal, (node.children[1].value as number) - 1),
					]),
				]);
			} else {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(TokenType.Operator, "*", [
						new ASTNode(TokenType.Function, "ln", [node.children[0]]),
						node,
					]),
					this.differentiate(node.children[1]),
				]);
			}
		} else if (node.nodeType === TokenType.Function) {
			let func: Function | undefined;
			Functions.forEach((funct) => {
				if (funct.name === node.value) {
					return new ASTNode(TokenType.Operator, "*", [funct.derivative(node.children)]);
				}
			});
			
			return new ASTNode(TokenType.Literal, 0);
		} else {
			return new ASTNode(TokenType.Literal, 0);
		}
	}
}
