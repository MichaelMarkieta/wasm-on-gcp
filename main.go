// Package main implements a fizzbuzz echo chamber.
package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime"
	"syscall/js"
	"time"
)

// getCallerFuncName returns the name of the caller 2 levels deep (e.g. fizz)
func getCallerFuncName() (callerFuncName string) {
	pc, _, _, _ := runtime.Caller(2)
	details := runtime.FuncForPC(pc)
	return details.Name()
}

// collect sends an HTTP request to our analytics collection endpoint
func collect(apikey string) (err error) {
	callerFuncName := getCallerFuncName()
	ts := time.Now().Format("2006-01-02 15:04:05.999999999")
	resp, err := http.Get(fmt.Sprintf("https://endpoints-5fbiknk2ba-uc.a.run.app/collect?key=%s&function=%s&ts=%s", apikey, callerFuncName, ts))
	if err != nil {
		log.Printf("Failed to send analytics: %s", err)
		return err
	}
	defer resp.Body.Close()
	return
}

// fizz echoes the string "fizz" back to the caller
func fizz(this js.Value, args []js.Value) interface{} {
	apikey := args[0].String()
	go func() {
		err := collect(apikey)
		if err != nil {
			// Ignore
		}
	}()
	return "fizz"
}

// buzz echoes the string "buzz" back to the caller
func buzz(this js.Value, args []js.Value) interface{} {
	apikey := args[0].String()
	go func() {
		err := collect(apikey)
		if err != nil {
			// Ignore
		}
	}()
	return "buzz"
}

// fizzbuzz echoes the string "fizzbuzz" back to the caller
func fizzbuzz(this js.Value, args []js.Value) interface{} {
	apikey := args[0].String()
	go func() {
		err := collect(apikey)
		if err != nil {
			// Ignore
		}
	}()
	return "fizzbuzz"
}

func registerCallbacks() {
	js.Global().Set("fizz", js.FuncOf(fizz))
	js.Global().Set("buzz", js.FuncOf(buzz))
	js.Global().Set("fizzbuzz", js.FuncOf(fizzbuzz))
}

func main() {
	fmt.Println("Registering wasm callbacks...")
	c := make(chan struct{}, 0)
	registerCallbacks()
	fmt.Println("...wasm ready!")
	<-c
}
