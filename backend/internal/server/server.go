package server

import (
	"net/http"
	"time"
)

func StartServer(PORT string, handler http.Handler) *http.Server {
	return &http.Server{
		Addr:    PORT,
		Handler: handler,
		// Security timeouts
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		// Additional security settings
		MaxHeaderBytes: 1 << 20, // 1MB
	}
}
