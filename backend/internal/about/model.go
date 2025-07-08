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
	Name         string
	Description  string
	Specialities []string
	Level        string
	Category     string
}

type TechnicalSkillDto struct {
	Skills []SkillItemDto `json:"skills"`
}
