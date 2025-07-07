package database

import (
	"fmt"
	"log"
	"os"

	"github.com/othersidedrl/portofolio/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	username := os.Getenv("POSTGRES_USER")
	if username == "" {
		username = "postgres"
	}
	password := os.Getenv("POSTGRES_PASSWORD")
	if password == "" {
		password = "yourpassword"
	}
	psqlDB := os.Getenv("POSTGRES_DB")
	if psqlDB == "" {
		psqlDB = "yourdbname"
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, username, password, psqlDB,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	// Auto-migrate tables
	err = db.AutoMigrate(
		&models.HeroPage{},
		&models.AboutPage{},
		&models.AboutCard{},
		&models.TechnicalSkills{},
		&models.CareerJourney{},
		&models.TestimonyPage{},
		&models.Testimony{},
		&models.ProjectPage{},
		&models.Project{},
		&models.User{},
		// You can add more models here
	)
	if err != nil {
		log.Fatal("Auto migration failed:", err)
	}

	log.Println("✅ Connected and migrated DB successfully!")
	return db
}
