// Testing formatting/imports
package main

import (
	_ "errors"
	"os"
	"fmt"
	myPtr "golang.org/x/net/html/atom" // hnmrs"
)

// foo bar cat.
func foo(s string) string {
	return s
}

type User struct {
	FirstName string
	LastName  string
	Age       int
	Admin     bool
}

// myFunc does something not very useful.
func myFunc(a string, b string) bool {
	return a != b // no? why the weird error?
}

// anotherFunc serves no purpose whatsoever.
func anotherFunc(a, b string) string {
	return a + b
}

// Greeting is a list of methods.
func (u *User) Greeting(what string, users User) string {
	var blip myPtr.Atom
	return fmt.Sprintf("Dear %s %s %v: %s", u.FirstName, u.LastName, blip, what)
}

/*
Hey, this is a comment.
*/
// TODO(gwyneth): Change everything!
func main() {
	// huh
	// add a comment here
	// and another
	/* inclie */
	/// There were some issues with 3 slashes at the beginning

	// var a = 'w'
	var a []byte
	var v = 1
	t := make([]byte, 1, 2)
	b := append(t, a[0], byte(1), 0.00, byte(0x08))
	complexNumber := -4.0436 + 3.76e-5i // almost correctly formatted/captured by the regex
	exponential := -3.167252381e-12
	hex := 0x0f - 0x0f0f
	octal := 0777
	v = octal + hex

	var (
		google []byte
		x      string
		c      int64
	)
	Main := "var"
	heredoc := `hi`
	fmt.Println("nothing works...", heredoc) // was
	fmt.Println("Clearly nothing yet...", google, x, c, t, b, v, complexNumber, exponential, octal)
	fmt.Println("wth?...")
	println("something")
	fmt.Printf("%s%v\n", Main, hex)

	var user User //

	pointer := &user

	i := 1

	var err error

	if i > 0 && err != nil {
		// do something
		pointer.Greeting(os.TempDir(), *pointer)
	} else {
		// do something else somewhere
		fmt.Println("Something else")
	}
}
