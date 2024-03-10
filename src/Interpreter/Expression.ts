import { ASTNode } from "./Misc";
import { Tokenizer } from "./Tokenizer";
import { Parser } from "./Parser";
import { Evaluator } from "./Evaluator";
import { Differentiator } from "./Differentiator";
import { simplify } from "./Simplifier";

export class Expression {
	abstractSyntaxTree: ASTNode;

	constructor(expression: string) {
		this.abstractSyntaxTree = simplify(new Parser().parse(new Tokenizer().tokenize(expression)));
		this.simplify();
	}

	evaluate(variables: [string, number][]) {
		return new Evaluator(variables).visit(this.abstractSyntaxTree);
	}

	differentiate() {
		this.abstractSyntaxTree = new Differentiator().differentiate(this.abstractSyntaxTree);
		this.simplify();
	}

	simplify() {
		this.abstractSyntaxTree = simplify(this.abstractSyntaxTree);
	}
}
