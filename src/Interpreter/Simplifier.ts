import { ASTNode, isConstant, TokenType } from "./Misc";
import { Evaluator } from "./Evaluator";

export function simplify(node: ASTNode): ASTNode {
	const nodeType = node.nodeType;
	const nodeValue = node.value;
	const children = node.children;
	if (isConstant(node)) {
		return new ASTNode(TokenType.Literal, new Evaluator().visit(node));
	} else if (nodeType === TokenType.Operator && nodeValue === "^" && simplify(children[1]).value === 1) {
		return simplify(children[0]);
	} else if (nodeType === TokenType.Operator && nodeValue === "^" && simplify(children[1]).value === 0) {
		return new ASTNode(TokenType.Literal, 1);
	} else if (
		nodeType === TokenType.Operator &&
		nodeValue === "*" &&
		(simplify(children[0]).value === 0 || simplify(children[1]).value === 0)
	) {
		return new ASTNode(TokenType.Literal, 0);
	} else if (nodeType === TokenType.Operator && nodeValue === "*" && simplify(children[0]).value === 1) {
		return simplify(children[1]);
	} else if (nodeType === TokenType.Operator && nodeValue === "*" && simplify(children[1]).value === 1) {
		return simplify(children[0]);
	} else if (
		nodeType === TokenType.Operator &&
		(nodeValue === "+" || nodeValue === "-") &&
		(simplify(children[0]).value === 0 || simplify(children[1]).value === 0)
	) {
		if (nodeValue === "-" && simplify(children[0]).value === 0) {
			return new ASTNode(TokenType.Operator, "u", [simplify(children[1])]);
		} else if (simplify(children[0]).value === 0) {
			return simplify(children[1]);
		} else {
			return simplify(children[0]);
		}
	} /*else if (
		nodeType === TokenType.Operator &&
		nodeValue === "*" &&
		(isConstant(children[0]) || isConstant(children[1])) &&
		(children[0].value === "*" || children[1].value === "*") &&
		(isConstant(children[0].children[0]) ||
			isConstant(children[0].children[1]) ||
			isConstant(children[1].children[0]) ||
			isConstant(children[1].children[1]))
	) {
		if (children[0].value === "*") {
			if (isConstant(children[0].children[0])) {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(
						TokenType.Literal,
						(simplify(children[1]).value as number) * (simplify(children[0].children[0]).value as number),
					),
					simplify(children[0].children[1]),
				]);
			} else {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(
						TokenType.Literal,
						(simplify(children[1]).value as number) * (simplify(children[0].children[1]).value as number),
					),
					simplify(children[0].children[0]),
				]);
			}
		} else {
			if (isConstant(children[1].children[0])) {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(
						TokenType.Literal,
						(simplify(children[0]).value as number) * (simplify(children[1].children[0]).value as number),
					),
					simplify(children[1].children[1]),
				]);
			} else {
				return new ASTNode(TokenType.Operator, "*", [
					new ASTNode(
						TokenType.Literal,
						(simplify(children[0]).value as number) * (simplify(children[1].children[1]).value as number),
					),
					simplify(children[1].children[0]),
				]);
			}
		}
	}*/ else if (children.size() > 0) {
		const nodeDuplicate = node;
		children.forEach((child, index) => {
			nodeDuplicate.children[index] = simplify(child);
		});
		return nodeDuplicate;
	} else {
		return node;
	}
}
