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
	Approved    bool   `json:"approved"`
}

type TestimonyDto struct {
	Testimonies []TestimonyItemDto `json:"testimonies"`
}

type ApproveTestimonyDto struct {
	Approved bool `json:"approved"`
}
