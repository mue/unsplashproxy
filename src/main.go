package main

import (
	"encoding/json"
	"os"

	"github.com/ddliu/go-httpclient"
	"github.com/gin-gonic/gin"

	_ "github.com/joho/godotenv/autoload"
)

func setupRouter() *gin.Engine {
	router := gin.New()
	
	router.GET("/", func (c *gin.Context) {
		c.JSON(200, gin.H{"message": "hello world"})
	})

	router.GET("/getImage", func(c *gin.Context) {
		res, err := httpclient.Get("https://api.unsplash.com/photos/random", map[string]string{
			"client_id":      os.Getenv("UNSPLASH_KEY"),
			"query":          "nature",
			"content_filter": "high",
			"featured":       "true",
			"orientation":    "landscape",
		})
		responseString, err := res.ToString()
		var data map[string]map[string]interface{}
		err = json.Unmarshal([]byte(responseString), &data)
		if err != nil {
			c.JSON(500, gin.H{"message": "Failed to request to the Unsplash API"})
		}
		c.JSON(200, gin.H{"file": data["urls"]["full"], "photographer": data["user"]["name"], "location": data["location"]["city"]})
	})

	return router
}

func main() {
	// Start webserver
	router := setupRouter()
	router.Run(os.Getenv("PORT"))
}
