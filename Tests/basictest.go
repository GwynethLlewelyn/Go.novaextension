package main

import (
	"fmt"
	myPtr "github.com/NoName/NoPackage"
)

// foo bar cat.
func foo(s string) {
}

type User struct {
	FirstName string
	LastName  string
	Age       int
	Admin     bool
}

// myFunc does something not very useful.
func myFunc(a string, b string) bool {
	return a != b
}

// List of methods.
func (u *User) Greeting() string {
	return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}

/*
	Hey, this is a comment
*/
// TODO(gwyneth): Change everything
func main() {
	// huh
	// add a comment here
	// and another
	/* inclie */

	// var a = 'w'
	var a []byte
	t := make([]byte, 1, 2)
	b := append(t, a[0], byte(1), 00.00, byte(0x08))
	complexNumber := 4.04 + -3.76i // not quite correctly formatted
	exponential := -3.1e5
	hex := 0x0f - 0x0f0f
	octal := 0777

	var (
		google []byte
		x      string
		c      int64
	)
	Main := "var"
	heredoc := `hi`
	fmt.Println("nothing works...", heredoc) // was
	fmt.Println("Clearly nothing yet...", google, x, c, t, b, complexNumber, exponential, octal)
	fmt.Println("wth?...")
	println("something")
	fmt.Printf("%s%v", Main, hex)

	var user User

	pointer := &user

	i := 1

	var err error

	if i > 0 && err != nil {
		// do something
		pointer.Greeting()
	} else {
		// do something else somewhere
		fmt.Println("Something else")
	}
}