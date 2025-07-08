package server

import (
	"net/http"
)

func StartServer(PORT string, handler http.Handler) *http.Server {
	return &http.Server{
		Addr:    PORT,
		Handler: handler,
	}
}
