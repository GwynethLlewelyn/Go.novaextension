// Testing formatting/imports
package main

import (
	_ "errors"
	"fmt"
	myPtr "golang.org/x/net/html/atom" // hnmrs"
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
	return a != b // no? why the weird error?
}

// Greeting is a list of methods.
func (u *User) Greeting() string {
	var blip myPtr.Atom
	return fmt.Sprintf("Dear %s %s %v", u.FirstName, u.LastName, blip)
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
	/// There were some issues with 3 slashes at the beginning

	// var a = 'w'
	var a []byte
	t := make([]byte, 1, 2)
	b := append(t, a[0], byte(1), 0.00, byte(0x08))
	complexNumber := -4.0436 + 3.76e-5i // almost correctly formatted/captired
	exponential := -3.167252381e-12
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
	fmt.Printf("%s%v\n", Main, hex)

	var user User //

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
