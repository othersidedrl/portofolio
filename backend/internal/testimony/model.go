package testimony

type TestimonyPageDto struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type TestimonyItemDto struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	ProfileUrl  string `json:"profileUrl"`
	Affiliation string `json:"affiliation"`
	Rating      int    `json:"rating"`
	Description string `json:"description"`
	AISummary   string `json:"aiSummary"`
}

type TestimonyDto struct {
	Testimonies []TestimonyItemDto `json:"testimonies"`
}
