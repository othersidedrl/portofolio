package hero

type HeroPageDto struct {
	Name        string   `json:"name"`
	Rank        string   `json:"rank"`
	Title       string   `json:"title"`
	Subtitle    string   `json:"subtitle"`
	ResumeLink  string   `json:"resume_link"`
	ContactLink string   `json:"contact_link"`
	ImageUrls   []string `json:"image_urls"`
	Hobbies     []string `json:"hobbies"`
}
