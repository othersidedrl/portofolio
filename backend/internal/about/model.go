package about

type CardDto struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type AboutPageDto struct {
	Description  string    `json:"description"`
	Cards        []CardDto `json:"cards"`
	GithubLink   string    `json:"github_link"`
	LinkedinLink string    `json:"linkedin_link"`
	Available    bool      `json:"available"`
}

type SkillItemDto struct {
	ID           uint     `json:"id"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Specialities []string `json:"specialities"`
	Level        string   `json:"level"`
	Category     string   `json:"category"`
}

type TechnicalSkillDto struct {
	Skills []SkillItemDto `json:"skills"`
}
