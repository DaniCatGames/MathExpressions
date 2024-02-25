enum Associativity {
	Left,
	Right,
}

const associativity = {
	"^": Associativity.Right,
	"*": Associativity.Left,
	"/": Associativity.Left,
	"+": Associativity.Left,
	"-": Associativity.Left,
};
