package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

//IP - IP
const IP = "localhost"

//PORT - host Port
const PORT = "8080"

func setHeaders(w http.ResponseWriter, req *http.Request) http.ResponseWriter {
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	return w
}

/*ImageListHandler Handle request with returning images list
 */
var ImageListHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	w = setHeaders(w, req)
	if req.Method == "OPTIONS" {
		return
	}
	payload, _ := json.Marshal(listFiles())
	w.Write([]byte(payload))
})

/*saveImages (amount int)
Gets the specified amount of adorable avarats and save to "images/" directory */
func saveImages(amount int) {
	//Check if images directory exist and create if not
	newpath := filepath.Join(".", "images")
	os.MkdirAll(newpath, os.ModePerm)

	startString := "http://api.adorable.io/avatars/face/"
	var data struct {
		Face struct {
			Eyes  []string
			Nose  []string
			Mouth []string
		}
	}
	getListResponse, _ := http.Get("http://api.adorable.io/avatars/list")
	dec := json.NewDecoder(getListResponse.Body)
	dec.Decode(&data)
	fmt.Println(data.Face.Eyes)
	for amount > 0 {
		eyes := data.Face.Eyes[rand.Intn(len(data.Face.Eyes))]
		nose := data.Face.Nose[rand.Intn(len(data.Face.Nose))]
		mouth := data.Face.Mouth[rand.Intn(len(data.Face.Mouth))]
		color := strconv.Itoa(rand.Intn(9)) + strconv.Itoa(rand.Intn(9)) + strconv.Itoa(rand.Intn(9))
		getRandomImgURL := startString + eyes + "/" + nose + "/" + mouth + "/" + color
		fmt.Println(getRandomImgURL)
		getImageResponse, _ := http.Get(getRandomImgURL)
		fmt.Println(getImageResponse)
		amount -= 1
		imgData, err := ioutil.ReadAll(getImageResponse.Body)
		if err != nil {
			log.Fatalf("ioutil.ReadAll -> %v", err)
		}
		getImageResponse.Body.Close()
		ioutil.WriteFile("images/"+strconv.Itoa(amount)+".png", imgData, 0666)
	}
}

/*listFiles () []string
Return the list of files names in "./images" directory */
func listFiles() []string {
	var list []string
	files, _ := ioutil.ReadDir("./images/")
	for _, f := range files {
		list = append(list, f.Name())
	}
	return list
}

func main() {
	rand.Seed(time.Now().Unix())
	if len(os.Args) > 1 {
		if os.Args[1] == "save" {
			saveImages(100)
		}
	}
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	var imagesFolder string
	flag.StringVar(&imagesFolder, "images", ".", "the directory to serve static files from.")
	flag.Parse()
	r := mux.NewRouter()
	api := r.PathPrefix("/api/").Subrouter()
	api.Handle("/getImagesList", ImageListHandler)
	r.PathPrefix("/images").Handler(c.Handler(http.FileServer(http.Dir(imagesFolder))))
	srv := &http.Server{
		Handler: handlers.LoggingHandler(os.Stdout, r),
		Addr:    IP + ":" + PORT,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
