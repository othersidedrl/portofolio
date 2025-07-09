package middleware

import (
	"bytes"
	"net/http"
)

type ResponseRecorder struct {
	http.ResponseWriter
	Body       *bytes.Buffer
	StatusCode int
}

func NewResponseRecorder(w http.ResponseWriter) *ResponseRecorder {
	return &ResponseRecorder{
		ResponseWriter: w,
		Body:           &bytes.Buffer{},
		StatusCode:     http.StatusOK,
	}
}

func (rec *ResponseRecorder) WriteHeader(code int) {
	rec.StatusCode = code
	rec.ResponseWriter.WriteHeader(code)
}

func (rec *ResponseRecorder) Write(b []byte) (int, error) {
	rec.Body.Write(b)
	return rec.ResponseWriter.Write(b)
}
