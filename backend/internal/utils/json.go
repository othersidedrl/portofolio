package utils

import (
	"encoding/json"
	"errors"
	"net/http"
)

var ErrInvalidJSON = errors.New("invalid JSON input")

// DecodeBody reads JSON from r and decodes into dst
func DecodeBody[T any](r *http.Request, dst *T) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		return ErrInvalidJSON
	}
	return nil
}
