package main

import (
	"bytes"
	"fmt"
	"gopkg.in/pipe.v2"
	"os"
	"sync"
)

func main() {

	features := os.Args[1:]

	for _, feature := range features {
		fmt.Println("Importing", feature)
		featureSources := sources[feature]

		var wg sync.WaitGroup

		// counts := make(chan int)

		wg.Add(len(featureSources))

		for _, source := range featureSources {
			go func(s Source) {

				defer wg.Done()

				fmt.Printf("Fetching from %s%s\n", s.UrlPrefix, s.Url)

				p := pipe.Line(
					pipe.Exec(
						"curl",
						"-L",
						s.Url
					),
					pipe.Exec(
						"ogr2ogr",
						"-f",
						"GeoJSON",
						"-t_srs",
						"crs:84",
						"/vsistdout/",
						"/vsistdin/",
					),
					pipe.Filter(func(line []byte) bool {
						return bytes.HasPrefix(line, []byte("{ \"type"))
					}),
					pipe.Replace(func(line []byte) []byte {
						lastCommaPos := bytes.LastIndex(line, []byte(","))
						if lastCommaPos == (len(line) - 2) {
							return line[:len(line) - 2]
						} else {
							return line
						}
					}),
					pipe.Exec(
						"mongoimport",
						"--host",
						"db",
						"--upsert",
						"--upsertFields",
						s.UpsertFields,
						"--collection",
						s.CollectionName,
						"--db",
						"boundaries",
					),
				)

				stdout, stderr, err := pipe.DividedOutput(p)

				if err != nil || stderr != nil {
					fmt.Printf("%v\n%v\n", err, string(stderr))
					return
				}

				fmt.Println(string(stdout))

			}(source)
		}

		wg.Wait()
	}

}
