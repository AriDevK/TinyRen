package audio

import (
	"log"
	"os"
	"time"

	"github.com/aridevk/tinyren/internal/constants"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/mp3"
	"github.com/gopxl/beep/speaker"
)

func Play(source string) {
	path := constants.PATH + source
	log.Println("Playing audio:", path)

	f, err := os.Open(path)
	if err != nil {
		log.Println("open:", err)
		return
	}
	defer f.Close()

	streamer, format, err := mp3.Decode(f)
	if err != nil {
		log.Println("decode:", err)
		return
	}
	defer streamer.Close()

	err = speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))
	if err != nil {
		log.Println("speaker init:", err)
		return
	}

	done := make(chan bool)

	speaker.Play(beep.Seq(
		streamer,
		beep.Callback(func() {
			done <- true
		}),
	))

	<-done
}
