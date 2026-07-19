package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8088"
	}

	app := fiber.New()
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"service": "shipping-service", "status": "ok"})
	})

	if err := app.Listen(":" + port); err != nil {
		panic(err)
	}
}
