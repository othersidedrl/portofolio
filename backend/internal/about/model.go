package about

import "time"

type CardDto struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedAt   time.Time `json:"created_at"`
}

type AboutPageDto struct {
	Description string    `json:"description"`
	Cards       []CardDto `json:"cards"`
	GithubLink  string    `json:"github_link"`
	Available   bool      `json:"available"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedAt   time.Time `json:"created_at"`
}
