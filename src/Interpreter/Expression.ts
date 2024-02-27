import { ASTNode } from "./Misc";
import { Tokenizer } from "./Tokenizer";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";

export class Expression {
	abstractSyntaxTree: ASTNode;

	constructor(expression: string) {
		this.abstractSyntaxTree = new Parser().parse(new Tokenizer().tokenize(expression));
	}

	evaluate(variables: [string, number][]) {
		return new Evaluator(variables).visit(this.abstractSyntaxTree);
	}
}
