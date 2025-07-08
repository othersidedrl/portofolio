package auth

import (
	"errors"
	"os"

	"github.com/alexedwards/argon2id"
	"github.com/othersidedrl/portfolio/backend/internal/utils"
)

// Service contains the business logic for auth
type Service struct {
	jwt *utils.JWTService
}

func NewService(jwt *utils.JWTService) *Service {
	return &Service{
		jwt: jwt,
	}
}

// Login checks the credentials and returns a token
func (s *Service) Login(email, password string) (string, error) {
	// Hardcoded check for now
	if email != os.Getenv("ADMIN_EMAIL") {
		return "", errors.New("Unauthorized")
	}

	match, err := argon2id.ComparePasswordAndHash(password, os.Getenv("ADMIN_PASSWORD_HASH"))
	if err != nil || !match {
		return "", errors.New("Unauthorized")
	}

	return s.jwt.GenerateToken(os.Getenv("ADMIN_ID"))

}
