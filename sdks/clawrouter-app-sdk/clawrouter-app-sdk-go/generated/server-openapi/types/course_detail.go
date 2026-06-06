package types

// Course detail schema exposed by Claw Router.
type CourseDetail struct {
	Category string `json:"category"`
	CategoryLabel string `json:"categoryLabel"`
	CommentCount string `json:"commentCount"`
	Content string `json:"content"`
	ContentId string `json:"contentId"`
	CourseCode string `json:"courseCode"`
	Currency string `json:"currency"`
	Description string `json:"description"`
	DurationText string `json:"durationText"`
	Engagement CourseEngagement `json:"engagement"`
	ExternalBvid string `json:"externalBvid"`
	Id string `json:"id"`
	Instructor CourseInstructor `json:"instructor"`
	IsCollection bool `json:"isCollection"`
	LessonsCount string `json:"lessonsCount"`
	Level string `json:"level"`
	LevelLabel string `json:"levelLabel"`
	PriceAmount string `json:"priceAmount"`
	PublishedAt string `json:"publishedAt"`
	RatingScore float64 `json:"ratingScore"`
	RelatedCourses []CourseItem `json:"relatedCourses"`
	Sections []CourseSectionItem `json:"sections"`
	Source CourseOverviewSource `json:"source"`
	StudentsCount string `json:"studentsCount"`
	Tags []string `json:"tags"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
}
